import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { GameConfig } from "../GameCommon/GameCommon";
import { UserData } from "../GameCommon/UserData";
import { ShareManager, ShareInfo } from "../ShareCommon/ShareManager";

export class StatisticsManager {

    private static readonly eventMap: Map<string, number> = new Map();

    //上传点击图片统计
    /**
     * 特殊参数说明：
            appId：上传新增玩家的游戏appId
            sourceType：来源类型，1 ：搜索，2 ：会话，3 ：跳转
            sourceAppId：来源游戏appId，当且仅当从其他小游戏跳转的情况需要填写具体sourceAppId，其余情况填写null或者空字符串。
     *  */
    public static uploadNewPlayerSource(sourceType: number, sourceAppId: string, wxLaunchOptions: string, phoneModel: string, scene: string, weixinadinfo: string, adChannel: string, adUserId: string): void {

        var url = ShareManager.statisticUrl + "/newPlayerSource";

        let data: any = {};

        data.appId = GameConfig.wxAppId;
        data.sourceType = sourceType;
        data.sourceAppId = sourceAppId;
        data.scene = scene;
        data.uuid = UserData.data.playerId;
        data.playerId = UserData.data.openId;
        data.phoneModel = phoneModel;
        data.city = ShareManager.city;
        data.wxLaunchOptions = wxLaunchOptions;
        data.weixinadinfo = weixinadinfo;
        data.adChannel = adChannel;
        data.adUserId = adUserId;
        data.getStoredDataSuccess = !UserData.loadRemoteDataFail;

        GameCommonHttp.wxHttpPost(url, data, null);
    }


    //上传分享图片统计
    public static uploadSharePictureRecord(shareType: string, shareInfo: ShareInfo, phoneModel: string): void {

        var url = ShareManager.statisticPictureUrl + "/sharePlayerPicture";

        let data: any = {};

        data.appId = GameConfig.wxAppId;
        data.pictureName = shareInfo.shareImgName;
        data.pictureType = shareType;
        data.content = shareInfo.shareText;
        data.pictureUrl = shareInfo.shareImgUrl;
        data.uuid = UserData.data.playerId;
        data.phoneModel = phoneModel;

        GameCommonHttp.wxHttpPost(url, data, null);
    }

    //上传点击图片统计
    public static uploadClickPictureRecord(shareType: string, shareImgName: string, shareText: string, shareImgUrl: string, shareTime: number, phoneModel: string, newPlayer: boolean): void {

        var url = ShareManager.statisticPictureUrl + "/v2/clickPlayerPicture";

        let data: any = {};

        data.appId = GameConfig.wxAppId;
        data.pictureName = shareImgName;
        data.pictureType = shareType;
        data.content = shareText;
        data.pictureUrl = shareImgUrl;
        data.uuid = UserData.data.playerId;
        data.phoneModel = phoneModel;
        data.newPlayer = newPlayer;
        data.shareTimeMillis = shareTime;

        GameCommonHttp.wxHttpPost(url, data, null);
    }

    //上传跳转小游戏记录
    public static uploadJumpRecord(jumpAppId: string, jumpAppName: string, jumpOperation: string, uploadCallBack: (retCode: number, retData: any) => void = null): void {

        var url = ShareManager.statisticUrl + "/playerJump";

        let data: any = {};

        data.appId = GameConfig.wxAppId;
        data.jumpAppId = jumpAppId;
        data.jumpAppName = jumpAppName;
        data.jumpOperation = jumpOperation;
        data.playerId = UserData.data.openId;
        data.uuid = UserData.data.playerId;
        data.weixinadinfo = UserData.data.weixinadinfo;
        data.adChannel = UserData.data.adChannel;
        data.adUserId = UserData.data.adUserId;

        GameCommonHttp.wxHttpPost(url, data, uploadCallBack);
    }

    /**
     * 上传第三方统计事件
     * @param eventName 统计事件的名称 建议使用中文
     * @param eventId 统计事件的id
     * @param params 统计事件的参数
     */
    public static thirdSendEvent(eventName: string, eventId: string = null, params: any = null): void {
        if (eventName == null || !CC_WECHATGAME) {
            return;
        }
        if (typeof wx.aldSendEvent === 'function') {
            params == null ? wx.aldSendEvent(eventName) : wx.aldSendEvent(eventName, params);
        }
        if (GameGlobal && GameGlobal.tdAppSdk && typeof GameGlobal.tdAppSdk.event === 'function') {
            params == null ? GameGlobal.tdAppSdk.event({ id: eventId ? eventId : eventName, label: eventName }) : GameGlobal.tdAppSdk.event({ id: eventId ? eventId : eventName, label: eventName, params: params });

        }
    }

    /**
     * 上传合作方统计事件
     * @param eventName 统计事件的名称 建议使用中文
     * @param eventId 统计事件的id
     * @param params 统计事件的参数
     */
    public static addImportantEvent(eventName: string): void {
        //调用普通事件
        this.thirdSendEvent(eventName);

        if (eventName == null) {
            return;
        }

        if (this.eventMap.has(eventName)) {
            let count = this.eventMap.get(eventName);
            this.eventMap.set(eventName, count + 1);
            return;
        }

        this.eventMap.set(eventName, 1);
    }

    /** 
     * 上传玩家登陆记录
     * @param loginTime 登陆时间
     */
    public static uploadPlayerLoginRecord(uploadCallBack: (retCode: number, retData: any) => void = null): void {
        let url = ShareManager.playerLoginRecordUrl + "/add";

        let data: any = {};
        data.uuid = UserData.data.playerId;
        data.quality = UserData.data.quality;
        data.newPlayer = UserData.newUser;
        data.newPlayerSourceType = UserData.data.newPlayerSourceType;
        if (UserData.data.sourceAppId) {
            data.sourceAppId = UserData.data.sourceAppId;
        }
        data.appId = GameConfig.wxAppId;
        data.createTimestamp = UserData.data.createTimestamp;

        if (UserData.lastOnShowTime) {
            let stayTime = (Date.now() - UserData.lastOnShowTime) * 0.001;
            data.stayTime = stayTime;
        }

        //添加事件统计
        if (this.eventMap && this.eventMap.size > 0) {
            let eventData: any = {};

            this.eventMap.forEach((eventCount, eventName) => {
                eventData[eventName] = eventCount;
            });

            data.eventMap = eventData;
        }

        let httpCallBack = function (resCode, retData: any) {
            //上传成功，回调清空eventMap
            if (resCode == 0) {
                UserData.newUser = false;
                StatisticsManager.eventMap.clear();
            }

            if (uploadCallBack) {
                uploadCallBack(resCode, retData);
            }
        }

        GameCommonHttp.wxHttpPost(url, data, httpCallBack);
    }
}

export enum StatisticsType {
    assistInvite = "点击助力邀请",
    assistCancelInvite = "取消发送助力",
    assistSuccInvite = "成功发送助力",
    assistSucc = "成功助力",
    assistShare = "助力分享",
}

export class PlayerLoginRecord {
    //是否是新用户(true:新用户；false:老用户)
    public static newPlayer: boolean = null;
    //用户来源分类
    public static newPlayerSourceType: number = null;
    //来源appId
    public static sourceAppId: string = null;
    //用户创建时间（long）
    public static createTimestamp: number = null;
    //本次登录停留时长（单位：秒）
    public static stayTime: number = null;
}