import { ISDK } from "./SDK/ISDK";
import { WxSDK } from "./SDK/WxSDK";
import { WebSDK } from "./SDK/WebSDK";
import { ShareManager, ShareControlType } from "../ShareCommon/ShareManager";
import { AdManager } from "../AdManager/AdManager";
import { PreLoadWxSDK } from "./SDK/PreLoadWxSDK";
import { UserData } from "./UserData";
import { WorldEventManager } from "./WorldEventManager";
import { WorldEventType } from "./WorldEventType";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        gameCommon: GameCommon;
    }
}

@ccclass
export class GameCommon extends cc.Component {

    @property({
        displayName: "wxAppId"
    })
    protected wxAppId: string = "";

    @property({
        displayName: "游戏名称缩写"
    })
    protected appName: string = "";

    @property({
        displayName: "游戏版本号"
    })
    protected versionCode: string = "1.0.0";

    @property({
        displayName: "视频广告id"
    })
    protected videoAdUnitId: string = "";

    @property({
        displayName: "banner广告id"
    })
    protected bannerAdUnitId: string = "";

    @property({
        displayName: "助力活动的id",
        type: [cc.String]
    })
    protected assistIdArray: string[] = new Array();

    @property({
        type: PreLoadWxSDK,
        displayName: "预加载wxSDK"
    })
    protected preLoadWxSDK: PreLoadWxSDK = null;

    @property({
        displayName: "试玩更多游戏的节点",
        type: cc.Node
    })
    protected moreGameNode: cc.Node = null;

    @property({
        displayName: "好友助力的节点",
        type: [cc.Node]
    })
    protected assistNodeArray: cc.Node[] = new Array();

    @property({
        displayName: "红包节点",
        type: [cc.Node]
    })
    protected redPacketNodeArray: cc.Node[] = new Array();

    @property({
        displayName: "分享节点",
        type: [cc.Node]
    })
    protected shareNodeArray: cc.Node[] = new Array();

    @property({
        displayName: "旧版本地用户数据key"
    })
    protected oldUserKey: string = "";

    @property({
        displayName: "是否保存数据到服务器"
    })
    protected saveRemoteData: boolean = true;

    @property({
        displayName: "分享是否区分新老用户"
    })
    protected diffUserForShare: boolean = false;

    protected _sdk: ISDK = null;

    protected storageDataInterval: number = 0;

    protected userDataInit: boolean = false;
    protected shareManagerInit: boolean = false;

    onLoad(): void {
        //把GameCommon设置成常驻节点
        cc.game.addPersistRootNode(this.node);
        window.gameCommon = this;

        GameConfig.wxAppId = this.wxAppId;
        GameConfig.wxAppName = this.appName;
        GameConfig.saveRemoteData = this.saveRemoteData;
        GameConfig.diffUserForShare = this.diffUserForShare;
        GameConfig.versionCode = this.versionCode;

        if (this.videoAdUnitId != null && this.videoAdUnitId != "") {
            GameConfig.videoAdUnitId = this.videoAdUnitId;
        }

        if (this.bannerAdUnitId != null && this.bannerAdUnitId != "") {
            GameConfig.bannerAdUnitId = this.bannerAdUnitId;
        }

        //设置助力活动id
        for (var assistId of this.assistIdArray) {
            if (GameConfig.assistIdArray.indexOf(assistId) != -1) {
                continue;
            }
            GameConfig.assistIdArray.push(assistId);
        }
        if (GameConfig.assistIdArray.indexOf("assist") != -1) {
            GameConfig.assistIdArray.push("assist");
        }

        //设置旧版用户UserKey
        if (this.oldUserKey != null && this.oldUserKey != "") {
            GameConfig.oldUserKey = this.oldUserKey;
        }

        if (GameCommon.isWechat()) {
            //初始化微信SDK
            this._sdk = new WxSDK();
            if (this.preLoadWxSDK != null) {
                this.preLoadWxSDK.initShareToDiffSuccessCall(this._sdk);
            }
            //初始化微信数据
            this._sdk.wxInitData();
            //初始化视频广告
            AdManager.initVideoAd();
        } else {
            this._sdk = new WebSDK();
        }

        //关闭分享时关闭所有与分享有关的节点
        for (var shareNode of this.shareNodeArray) {
            shareNode.active = false;
        }

        //默认关闭所有与红包有关的节点
        for (var redPacketNode of this.redPacketNodeArray) {
            redPacketNode.active = false;
        }

        //关闭试玩模块
        if (this.moreGameNode != null) {
            this.moreGameNode.active = false;
        }

        //关闭助力
        for (var assistNode of this.assistNodeArray) {
            assistNode.active = false;
        }

        var self = this;
        var initSuccCallBack = function (): void {
            console.log("ShareManager Init Call");

            //关闭分享时关闭所有与分享有关的节点
            for (var shareNode of self.shareNodeArray) {
                shareNode.active = ShareManager.getShareControlType() != ShareControlType.ShareAndAdClose;
            }
            //关闭所有与红包有关的节点
            for (var redPacketNode of self.redPacketNodeArray) {
                redPacketNode.active = ShareManager.getRedPacketControl();
            }
            //关闭试玩模块
            if (self.moreGameNode != null) {
                self.moreGameNode.active = ShareManager.getTryMoreGameControl();
            }

            for (var assistNode of self.assistNodeArray) {
                assistNode.active = ShareManager.getAssitControl();
            }

            self.shareManagerInit = true;
            self.appGameLaunch();
        }

        /**
         * 初始化下载分享相关配置
         * @param wxAppId //获取分享开关以及获取分享配置需要的appId
         * @param appName //获取分享配置需要的游戏名称缩写，需要与oss上一致
         */
        ShareManager.init(initSuccCallBack);
    }

    start(): void {
        WorldEventManager.addListener(WorldEventType.GetUserDataFinish, () => {
            this.userDataInit = true;
            this.appGameLaunch();
        }, this);
    }

    update(dt: number): void {

        if (!UserData.init || this._sdk == null) {
            return;
        }

        this.storageDataInterval += dt;

        //每隔一分钟定时调用保存数据到微信本地
        if (this.storageDataInterval >= 60) {
            this._sdk.setStorage(UserData.storageKey, UserData.getJsonStr());
            this.storageDataInterval = 0;
        }
    }

    /**
     * 游戏正常启动后执行的逻辑,会在获取到用户数据和加载游戏配置数据成功后被调用
     */
    protected appGameLaunch(): void {
        if (!this.userDataInit || !this.shareManagerInit) {
            return;
        }
        if (this._sdk) {
            this._sdk.appGameOnLanch();
        }
    }

    /**
     * @return ISDK
     */
    public get getSDK(): ISDK {
        return this._sdk;
    }

    public static isQQ(): boolean {

        return CC_QQPLAY;
    }

    public static isWechat(): boolean {
        return CC_WECHATGAME;
    }

    public static isWeb(): boolean {
        return cc.sys.isBrowser;
    }
}

export class GameConfig {

    public static readonly DefaultChannelId: string = "dmm";

    public static wxAppId: string = "exzample_id";

    public static wxAppName: string = "exzample_name";

    public static versionCode: string = "1.0.0";

    public static currentChannelId: string = GameConfig.DefaultChannelId;

    public static videoAdUnitId: string = null;

    public static bannerAdUnitId: string = null;

    //助力活动的id列表
    public static assistIdArray: Array<string> = new Array();

    public static oldUserKey: string = null;

    public static saveRemoteData: boolean = true;

    public static diffUserForShare: boolean = false;
}
