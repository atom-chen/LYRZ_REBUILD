import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { GameConfig } from "../GameCommon/GameCommon";

export class ShareManager {

    public static statisticUrl: string = "https://statistic2.ttigd.cn/statistic-service/statistic";

    public static playerLoginRecordUrl: string = "https://statistic2.ttigd.cn/statistic-service/playerLogin";

    public static accessTokenUrl: string = "https://hfapi2.ttigd.cn/wegame-service/codeToAccessToken";

    public static assistanceUrl: string = "https://hfapi2.ttigd.cn/assistance-service/assistance";

    public static statisticPictureUrl: string = "https://statistic2.ttigd.cn/statistic-service/picture";

    //默认分享图
    private static defaultShareInfo: ShareInfo = null;
    //低质量分享图组
    private static readonly lowShareInfos: Array<ShareInfo> = new Array();
    //高质量分享图组
    private static readonly highShareInfos: Array<ShareInfo> = new Array();

    /**
     * @deprecated 废弃
     */
    public static getShareFlagUrl: string = "https://hfapi2.ttigd.cn/wegame-service/new/shareFlags/query";

    public static getNewShareFlagUrl: string = "https://hfapi2.ttigd.cn/wegame-service/new/shareFlags/query";

    private static getShareConfigUrl: string = "https//hffile.ttigd.cn/share/";

    private static masterControl: boolean = false;//总开关，默认打开

    private static shareControl: boolean = true;//分享开关，默认打开,关闭则使用视频

    private static abnormalShareControl: boolean = true;//非正常分享开关，默认打开,关闭则使用普通分享

    private static shareImgControl: boolean = true;//分享图高质量（正常）是否开启，默认打开，开启后才会根据城市判断是否使用低质量（低俗）的图，否则一律使用高质量（正常）的图

    private static firstTile: boolean = true;//是否属于一线城市，默认属于

    private static tryMoreGameControl: boolean = true;//是否开启试玩更多游戏模块，默认开启

    private static pickCoinGameControl: boolean = true;//是否开启捡金币小游戏模块，默认开启

    private static redPacketControl: boolean = true;//是否开启红包模块，默认开启

    private static helpControl: boolean = true;//是否好友助力，默认开启

    private static luckyPacketControl: boolean = true;//是否开启福袋模块，默认开启

    private static volationShareControl: boolean = true;//是否开启违规分享，默认开启

    private static navigateControl: boolean = false;//是否开启跳转其他小游戏，默认关闭

    private static bannerAdControl: boolean = true;//是否开启banner广告，默认开启

    public static city: string = null;//玩家所属城市

    public static shareFlags: any = null;//存放shareFlags获取的开关配置的源数据
    public static configData: any = null;//存放cdn获取的config配置的源数据

    /**
     * 初始化分享配置
     * @param shareControlFlag //获取分享开关需要的flag
     */
    public static init(initSuccCallBack: () => void = null): void {

        var appName = GameConfig.wxAppName;

        this.getShareConfigUrl = "https://hffile.ttigd.cn/game-common/" + appName + "/newConfig.txt?time=" + Date.now();

        this.defaultShareInfo = new ShareInfo(
            "default",
            "又发现一个好玩的小游戏，来试试吧~",
            "https://hffile.ttigd.cn/game-common/" + appName + "/default.png"
        );

        var self = this;
        var initShareConfigCall = function (): void {

            var initShareCall = function (): void {
                //微信登录获取sessionKey
                window.gameCommon.getSDK.login();
                if (initSuccCallBack != null) {
                    initSuccCallBack();
                }
            }
            //下载分享配置
            self.initShareControl(GameConfig.wxAppId, GameConfig.versionCode, initShareCall);
        }

        this.initShareConfig(initShareConfigCall);
    }

    private static initShareConfig(initShareConfigCall: () => void): void {

        var self = this;

        var callBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null) {
                if (initShareConfigCall != null) {
                    initShareConfigCall();
                }
                return;
            }
            ShareManager.configData = retData;
            if (retData.statisticUrl != null) {
                ShareManager.statisticUrl = retData.statisticUrl;
                console.log(retData.statisticUrl);
            }
            if (retData.statisticPictureUrl != null) {
                ShareManager.statisticPictureUrl = retData.statisticPictureUrl;
                console.log(retData.statisticPictureUrl);
            }
            if (retData.accessTokenUrl != null) {
                ShareManager.accessTokenUrl = retData.accessTokenUrl;
                console.log(retData.accessTokenUrl);
            }
            if (retData.getNewShareFlagUrl != null) {
                ShareManager.getNewShareFlagUrl = retData.getNewShareFlagUrl;
                console.log(retData.getNewShareFlagUrl);
            }
            if (retData.playerLoginRecordUrl) {
                ShareManager.playerLoginRecordUrl = retData.playerLoginRecordUrl;
            }
            if (retData.assistanceUrl != null) {
                ShareManager.assistanceUrl = retData.assistanceUrl;
                console.log(retData.assistanceUrl);
            }
            var shareImgConfig = retData.shareInfos;
            if (shareImgConfig != null) {
                for (var shareImg of shareImgConfig) {
                    self.addShareInfo(shareImg.shareKey, shareImg.shareText, shareImg.shareImgUrl, shareImg.shareImgName);
                }
            }
            if (initShareConfigCall != null) {
                initShareConfigCall();
            }
        };

        GameCommonHttp.wxHttpGet(this.getShareConfigUrl, callBack);
    }

    private static initShareControl(wxAppId: string, versionCode: string, initSuccCallBack: () => void): void {

        var callBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null || retData.data == null) {
                if (initSuccCallBack != null) {
                    initSuccCallBack();
                }
                return;
            }
            if (retData.data.highLevelCity != null) {
                ShareManager.firstTile = retData.data.highLevelCity;
            }
            if (retData.data.city != null) {
                ShareManager.city = retData.data.city;
            }
            var shareFlags = retData.data.shareFlags;
            if (shareFlags == null) {
                if (initSuccCallBack != null) {
                    initSuccCallBack();
                }
                return;
            }
            ShareManager.shareFlags = shareFlags;
            if (shareFlags["masterControl"] != null) {
                ShareManager.masterControl = shareFlags["masterControl"];
                ShareManager.bannerAdControl = ShareManager.masterControl;
            }
            if (shareFlags["shareControl"] != null) {
                ShareManager.shareControl = shareFlags["shareControl"];
            }
            if (shareFlags["abnormalShareControl"] != null) {
                ShareManager.abnormalShareControl = shareFlags["abnormalShareControl"];
            }
            if (shareFlags["shareImgControl"] != null) {
                ShareManager.shareImgControl = shareFlags["shareImgControl"];
            }
            if (shareFlags["tryMoreGameControl"] != null) {
                ShareManager.tryMoreGameControl = shareFlags["tryMoreGameControl"];
            }
            if (shareFlags["pickCoinGameControl"] != null) {
                ShareManager.pickCoinGameControl = shareFlags["pickCoinGameControl"];
            }
            if (shareFlags["redPacketControl"] != null) {
                ShareManager.redPacketControl = shareFlags["redPacketControl"];
            }
            if (shareFlags["helpControl"] != null) {
                ShareManager.helpControl = shareFlags["helpControl"];
            }
            if (shareFlags["luckyPacketControl"] != null) {
                ShareManager.luckyPacketControl = shareFlags["luckyPacketControl"];
            }
            if (shareFlags["volationShareControl"] != null) {
                ShareManager.volationShareControl = shareFlags["volationShareControl"];
            }
            if (shareFlags["navigateControl"] != null) {
                ShareManager.navigateControl = shareFlags["navigateControl"];
            }
            if (initSuccCallBack != null) {
                initSuccCallBack();
            }
        };
        var getNewShareFlagUrl = this.getNewShareFlagUrl + "?appId=" + wxAppId + "&version=" + versionCode;
        GameCommonHttp.wxHttpGet(getNewShareFlagUrl, callBack);
    }

    public static addShareInfo(shareKey: string, shareText: string, shareImgUrl: string, shareImgName: string): void {
        if (shareKey == null || shareText == null || shareImgUrl == null) {
            return;
        }
        var shareInfo = new ShareInfo(shareKey, shareText, shareImgUrl);
        shareInfo.shareImgName = shareImgName;
        if (shareKey == "high") {
            this.highShareInfos.push(shareInfo);
        } else {
            this.lowShareInfos.push(shareInfo);
        }        
    }

    /**
     * 获取分享开关，当分享关闭时判断视频开关
     * @returns ShareControlType.ShareAndAdClose 分享和视频全部关闭
     * @returns ShareControlType.ShareAndAdOpen 分享和视频全部打开
     * @returns ShareControlType.ShareCloseAndAdOpen 分享关闭视频打开
     * @returns ShareControlType.VolationShareCloseAndAdOpen 违规分享关闭视频打开
     */
    public static getShareControlType(): ShareControlType {
        if (!this.masterControl) {
            return ShareControlType.ShareAndAdClose;
        }
        if (!this.shareControl) {
            return ShareControlType.ShareCloseAndAdOpen;
        }
        if (!this.volationShareControl) {
            return ShareControlType.VolationShareCloseAndAdOpen;
        }
        return ShareControlType.ShareAndAdOpen;
    }

    /**
     * 获取分享活动的开关
     * @returns 返回分享活动的开关 关闭时所有分享弹出后不再会有提示
     */
    public static getAbonormalShareControl(): boolean {
        return this.masterControl && this.abnormalShareControl;
    }

    /**
     * 获取试玩更多游戏的开关
     */
    public static getTryMoreGameControl(): boolean {
        return this.tryMoreGameControl && this.masterControl;
    }

    /**
     * 获取捡金币小游戏的开关
     */
    public static getPickCoinGameControl(): boolean {
        return this.pickCoinGameControl && this.masterControl;
    }

    /**
     * 获取红包活动的开关
     */
    public static getRedPacketControl(): boolean {
        return this.redPacketControl && this.masterControl;
    }

    /**
     * 获取福袋活动的开关
     */
    public static getLuckyPacketControl(): boolean {
        return this.luckyPacketControl && this.masterControl;
    }

    /**
     * 获取助力活动开关
     */
    public static getAssitControl(): boolean {
        return this.masterControl && this.helpControl;
    }

    /**
     * 获取开始游戏跳转其他小游戏的开关
     */
    public static getNavigateControl(): boolean {
        return this.navigateControl;
    }

    /**
     * 获取banner广告的控制开关
     */
    public static getBannerAdControl(): boolean {
        return this.bannerAdControl;
    }

    /**
     * 获取分享信息（文案和图片链接）
     * 根据IP所在城市获取分享信息，一线城市使用高质量（正常）的分享，二线城市使用低质量（低俗）的分享
     */
    public static getCityShareInfo(): ShareInfo {
        if (!this.masterControl) {
            return this.getHighShareInfo();
        }
        if (!this.shareControl) {
            return this.getHighShareInfo();
        }
        if (!this.shareImgControl) {
            return this.getHighShareInfo();
        }
        return this.getLowShareInfo();
    }

    private static getHighShareInfo(): ShareInfo {
        let length = this.highShareInfos.length;
        if (length <= 0) {
            return this.getDefaultShareInfo();
        }
        let randomIndex = Math.round(Math.random() * (length - 1));
        return this.highShareInfos[randomIndex];
    }

    private static getLowShareInfo(): ShareInfo {
        let length = this.lowShareInfos.length;
        if (length <= 0) {
            return this.getDefaultShareInfo();
        }
        let randomIndex = Math.round(Math.random() * (length - 1));
        return this.lowShareInfos[randomIndex];
    }

    private static getDefaultShareInfo(): ShareInfo {
        return this.defaultShareInfo;
    }
}

export class ShareInfo {
    private _shareKey: string = null;
    public get shareKey(): string {
        return this._shareKey;
    }
    public set shareKey(value: string) {
        this._shareKey = value;
    }
    private _shareText: string = null;
    public get shareText(): string {
        return this._shareText;
    }
    public set shareText(value: string) {
        this._shareText = value;
    }
    private _shareImgUrl: string = null;
    public get shareImgUrl(): string {
        return this._shareImgUrl;
    }
    public set shareImgUrl(value: string) {
        this._shareImgUrl = value;
    }
    private _shareImgName: string = "默认图";
    public get shareImgName(): string {
        return this._shareImgName;
    }
    public set shareImgName(value: string) {
        this._shareImgName = value;
    }
    constructor(shareKey: string, shareText: string, shareImgUrl: string) {
        this.shareKey = shareKey;
        this.shareText = shareText;
        this.shareImgUrl = shareImgUrl;
    }
    public get convertCityText(): string {
        if (ShareManager.city == null || ShareManager.city == "null") {
            return this.shareText.replace("[城市]", "广州");
        }
        if (this.shareText != null && ShareManager.city != null) {
            return this.shareText.replace("[城市]", ShareManager.city);
        }
        return this.shareText;
    }
}

export enum ShareControlType {
    ShareAndAdClose = 1,//分享和视频全部关闭
    ShareAndAdOpen = 2,//分享和视频全部打开
    ShareCloseAndAdOpen = 3,//分享关闭视频打开
    VolationShareCloseAndAdOpen = 4,//违规分享关闭视频打开
}
