import { ISDK } from "./ISDK";
import { GameConfig } from "../GameCommon";
import { ShareManager, ShareControlType, ShareInfo } from "../../ShareCommon/ShareManager";
import { UserData } from "../UserData";
import { GameCommonUtil } from "../GameCommonUtil";
import { MoreGameManager } from "../../MoreGame/MoreGameManager";
import { TipManager } from "../../Tip/TipManager";
import { GameCommonHttp } from "../GameCommonHttp";
import { StatisticsManager, StatisticsType } from "../../StatisticsManager/StatisticsManager";
import { AddTipConfig } from "../../Tip/AddWxSmallGameConf";
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;

export class WxSDK implements ISDK {

    public readonly systemInfo: SystemInfo = new SystemInfo();

    private onShowCall: (res: any) => void = null;
    private onHideCall: () => void = null;

    //微信最后执行onHide的时间
    private onHideTime: number = 0;
    //微信分享对应的次数
    private shareCountMap: Map<string, number> = new Map();
    //临时微信onShow回调，调用一次后废弃
    private tempOnShowCall: (res: any) => void = null;

    private shareToDiffGroupCallMap: Map<string, () => void> = new Map();

    private feedbackButton: any = null;

    private launchUpload: boolean = false;//是否执行过启动上传记录，默认未执行

    private levelShareFailCount: number = 0;

    private shareTime: number = 0;//点击分享的时间戳
    private shareType: string = null;//分享点击类型
    private shareInfo: ShareInfo = null;//分享点击信息

    constructor() {
        this.keepScreenOn();
        this.showShareMenu();
    }

    getSystemInfo(): SystemInfo {
        return this.systemInfo;
    }

    /**
     * 跳转小游戏
     * @param jumpAppId 跳转小程序的APPID
     * @param jumpPath 跳转地址
     * @param callBack 跳转成功的回调
     */
    public navigateToMiniProgram(jumpAppId: string, jumpPath: string, callBack?: (success: boolean) => void): void {

        if (typeof (wx.navigateToMiniProgram) !== 'function') {
            return;
        }

        if (jumpPath == null || jumpPath == "" || jumpPath.indexOf("?") == -1) {
            jumpPath = "?adUserAppJump=true";
        } else {
            jumpPath = jumpPath + "&adUserAppJump=true";
        }

        if (UserData.data.weixinadinfo != null) {
            jumpPath = jumpPath + "&weixinadinfo=" + UserData.data.weixinadinfo;
            jumpPath = jumpPath + "&adChannel=" + UserData.data.adChannel;
            jumpPath = jumpPath + "&adUserId=" + UserData.data.adUserId;
        }

        wx.navigateToMiniProgram({
            appId: jumpAppId,
            path: jumpPath,
            //二次跳转体验版使用 envVersion: "trial",//正式版删除
            extraData: GameConfig.wxAppId,
            success: function () {
                if (callBack) {
                    callBack(true);
                }
            },
            fail: function () {
                if (callBack) {
                    callBack(false);
                }
            }
        });
    }

    /**
     * 微信预览图片
     * @param url 需要展示单张图片的url
     * @param urls 需要展示一组图片的url数组
     */
    previewImage(url?: string, urls?: Array<string>): void {

        if (url == null && urls == null) {
            return;
        }

        if (typeof (wx.previewImage) !== 'function') {
            return;
        }

        var imgUrls = urls || new Array();

        if (url != null) {
            imgUrls.push(url);
        }

        wx.previewImage({
            urls: imgUrls
        });
    }

    /**
     * 显示微信意见反馈按钮
     * @param left 左上角横坐标
     * @param top 左上角纵坐标
     * @param 投诉图片的在resource文件下的位置
     */
    showFeedbackButton(left: number, top: number, imagePath: string): void {

        if (typeof wx.createFeedbackButton !== "function") {
            return;
        }

        this.destroyFeedbackButton();

        let button = wx.createFeedbackButton({
            type: 'image',
            image: imagePath,
            style: {
                left: left,
                top: top,
                width: 45,
                height: 45,
                lineHeight: 15,
                backgroundColor: '#FFFFFF',
                color: '#000000',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });
        button.show();
        this.feedbackButton = button;
    }

    /**
     * 销毁微信意见反馈按钮
     */
    destroyFeedbackButton(): void {
        if (this.feedbackButton == null) {
            return;
        }
        this.feedbackButton.destroy();
        this.feedbackButton = null;
    }

    /**
     * 保存数据到微信中
     * @param storageKey 本地缓存中指定的 key
     * @param storageData 需要被保存的数据，暂定只保存string
     */
    public setStorage(storageKey: string, storageData: string): void {
        wx.setStorage({
            key: storageKey,
            data: storageData
        });
    }

    /**
     * 从微信中获取数据
     * @param storageKey 本地缓存中指定的 key 
     */
    public getStorage(storageKey: string): string {
        return wx.getStorageSync(storageKey);
    }

    public vibrateShort(): void {
        if (typeof wx.vibrateShort !== "function") {
            return;
        }
        wx.vibrateShort();
    }

    public vibrateLong(): void {
        if (typeof wx.vibrateLong !== "function") {
            return;
        }
        wx.vibrateLong();
    }

    /**
     * 获取微信启动参数
     * @return launchOption
     */
    getLaunchOptions(): any {
        return wx.getLaunchOptionsSync();
    }

    /**
     * 注册微信游戏onShow事件,launch不会触发onShow回调
     * @param callBack 
     */
    registerOnShow(callBack: (res: any) => void): void {
        this.onShowCall = callBack;
    }

    /**
     * 注册微信游戏隐藏事件
     * @param callBack 
     */
    registerOnHide(callBack: () => void): void {
        this.onHideCall = callBack;
    }

    /**
    * 设置屏幕常亮 
    */
    private keepScreenOn(): void {
        if (typeof (wx.setKeepScreenOn) === 'function') {
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        }
    }

    /**
    * 显示分享菜单
    */
    private showShareMenu(): void {
        if (typeof (wx.showShareMenu) === 'function') {
            wx.showShareMenu({
                withShareTicket: true
            });
        }
    }

    /**
     * 微信登录 主要用于获取sessionKey
     */
    login(): void {

        var self = this;

        wx.login({
            success: function (res: any): void {
                console.log("wxLogin succ  res.code is : " + res.code);
                WxSDK.loginInfo.code = res.code;
                self.getSessionKey();
            },

            fail: function (res: any): void {
                wx.showModal({
                    title: "登陆失败",
                    content: "请检查网络后重试~",
                    showCancel: false,
                    cancelText: "取消",
                    confirmText: "确定",
                    success: function (res: any): void {
                        if (res.confirm) {
                            self.login();
                        }
                    }
                });
            },
        });
    }

    /**
     * 游戏启动，确保最多只执行一次
     */
    appGameOnLanch(): void {

        if (this.launchUpload) {
            return;
        }
        this.launchUpload = true;

        let res = this.getLaunchOptions();
        if (!res) {
            return;
        }

        let scene = res.scene;
        let query = res.query;
        if (!query) {
            return;
        }

        //获取启动参数并执行onShow
        this.onShow(res, true, UserData.newUser);

        //新玩家上传新玩家来源统计
        if (!UserData.newUser) {
            return;
        }

        let sourceAppId = res.referrerInfo ? res.referrerInfo.appId : null;
        let sharePlayerId = query.sharePlayerId;
        let extraDataAppId = res.referrerInfo && res.referrerInfo.extraData ? res.referrerInfo.extraData.appid : null;
        let weixinadinfo = query.weixinadinfo;
        let adChannel = query.adChannel;
        let adUserId = query.adUserId;
        let adUserAppJump = query.adUserAppJump;
        let otherChannelKey = query.otherChannelKey;

        let sourceType = 1;

        if (sourceAppId == null && sharePlayerId == null) {
            sourceType = 1;//搜索
        } else if (sourceAppId != null) {

            if (sourceAppId == GameConfig.wxAppId) {
                sourceType = 2;//会话
            } else if (extraDataAppId == GameConfig.wxAppId) {
                sourceType = 4;//附近热玩
                sourceAppId = extraDataAppId;
            } else {
                sourceType = 3;//其他小程序跳转
            }
        } else {
            sourceType = 2;//会话
        }

        if (weixinadinfo != null) {
            if (adUserAppJump) {
                sourceType = 103;//广告新增其他小程序跳转新增
            } else if (sharePlayerId != null) {
                sourceType = 102;//广告新增会话新增
            } else {
                sourceType = 101;//广告新增
            }
            if (adUserId == null) {
                adUserId = GameCommonUtil.uuid();
            }
            UserData.data.weixinadinfo = weixinadinfo;
            UserData.data.adChannel = adChannel;
            UserData.data.adUserId = adUserId;
        }

        let wxLaunchOptions = {
            query: query,
            referrerInfo: res.referrerInfo
        }
        let phoneModel = this.systemInfo.brand + this.systemInfo.model + this.systemInfo.system;

        //记录玩家数据并保存起来
        UserData.data.sourceAppId = sourceAppId;
        UserData.data.newPlayerSourceType = sourceType;
        UserData.data.createTimestamp = Date.now();
        //来自于query的渠道优先统计进sourceAppId中
        let dmmOutChannel = query.dmmOutChannel;
        if (dmmOutChannel != null) {
            UserData.data.sourceAppId = dmmOutChannel;
        }
        else if (otherChannelKey != null) {
            UserData.data.sourceAppId = otherChannelKey;
        }
        else if (sourceType == 3) { //当其他小程序跳转过来，并且不带otherChannelKey参数时，使用源wxId
            UserData.data.sourceAppId = sourceAppId;
        }

        StatisticsManager.uploadNewPlayerSource(sourceType, sourceAppId, JSON.stringify(wxLaunchOptions), phoneModel, scene, weixinadinfo, adChannel, adUserId);
    }

    public wxInitData(): void {

        var self = this;

        this.wxGetSystemInfo();

        var jsonDataStr = window.gameCommon.getSDK.getStorage(UserData.storageKey);
        if (jsonDataStr && jsonDataStr !== "") {
            UserData.parseFromStr(jsonDataStr);
        }

        //如果有老的数据则也认为不是新用户
        if (GameConfig.oldUserKey) {
            let oldJsonDataStr = window.gameCommon.getSDK.getStorage(GameConfig.oldUserKey);
            if (oldJsonDataStr && oldJsonDataStr !== "") {
                UserData.newUser = false;
            }
        }

        if (!GameConfig.saveRemoteData) {
            UserData.loadRemoteDataFail = true;
            UserData.init = true;
        }

        //监听用户点击右上角菜单的“转发”按钮时触发的事件
        let shareAppMessageFunc = function (res) {

            var shareInfo = ShareManager.getCityShareInfo();

            self.shareTime = Date.now();
            self.shareType = "右上角分享";
            self.shareInfo = shareInfo;

            StatisticsManager.thirdSendEvent("右上角分享");

            var shareMsg = shareInfo.convertCityText;

            var shareUrl = shareInfo.shareImgUrl + "?timestate=" + self.shareTime;

            var extendInfo = "&shareType=右上角分享";
            extendInfo = extendInfo + "&shareImgUrl=" + shareInfo.shareImgUrl;
            extendInfo = extendInfo + "&shareImgName=" + shareInfo.shareImgName;
            extendInfo = extendInfo + "&shareText=" + shareInfo.shareText;

            if (GameGlobal && GameGlobal.tdAppSdk && typeof GameGlobal.tdAppSdk.share === 'function') {
                GameGlobal.tdAppSdk.share({
                    title: shareMsg,
                    path: shareUrl
                });
            }

            return {
                title: shareMsg,

                imageUrl: shareUrl,

                query: self.getQueryParam(extendInfo),
            }
        }
        if (typeof wx.aldOnShareAppMessage !== 'function') {
            wx.onShareAppMessage(shareAppMessageFunc);
        } else {
            wx.aldOnShareAppMessage(shareAppMessageFunc);
        }

        //添加最小化游戏时上传客户端事件
        wx.onHide(function () {
            console.log("hide call");
            self.onHideTime = Date.now();
            try {
                if (self.onHideCall != null) {
                    self.onHideCall();
                }
            } catch (error) {
                console.log(error);
            }
            self.setStorage(UserData.storageKey, UserData.getJsonStr());
            if (GameConfig.saveRemoteData && GameConfig.wxAppId && UserData.data.openId) {
                let userDataStr = UserData.getJsonStr();
                let data: any = {};
                data.appId = GameConfig.wxAppId;
                data.openId = UserData.data.openId;
                data.info = userDataStr;
                data.weixinadinfo = UserData.data.weixinadinfo;
                data.adChannel = UserData.data.adChannel;
                data.adUserId = UserData.data.adUserId;
                let url: string = "https://hfapi2.ttigd.cn//dataStorage-service/dataStorage/saveUserInfo";
                GameCommonHttp.wxHttpPost(url, data, (retCode: number, retData: any) => {
                    console.log("get user data retCode:" + retCode);
                    console.log("get user data retData: ", retData);
                });
            }

            //upload player login record  
            if (UserData.data.createTimestamp) {//过滤老用户
                StatisticsManager.uploadPlayerLoginRecord((retCode: number, retData: any) => {
                    console.log("upload playerLoginRecord retCode:" + retCode);
                    console.log("upload playerLoginRecord retData: ", retData);
                });
            }
        });

        //添加监听wx的onShow
        wx.onShow(function (res) {
            try {
                if (self.tempOnShowCall != null) {
                    self.tempOnShowCall(res);
                    self.tempOnShowCall = null;
                }
                if (self.onShowCall != null) {
                    self.onShowCall(res);
                }
            } catch (error) {
                console.log(error);
            }
            //获取试玩奖励
            for (var moreGameInfo of UserData.data.tryMoreGameInfos) {
                if (moreGameInfo.hasReward) {
                    if (moreGameInfo.tryGameTime != 0) {
                        var intervalTime = Date.now() - moreGameInfo.tryGameTime;
                        console.log(intervalTime);
                        if (intervalTime >= 60 * 1000) {
                            moreGameInfo.hasReward = false;
                            UserData.data.coin += moreGameInfo.rewardNum;
                            TipManager.showTip("试玩成功，获得" + GameCommonUtil.getShotNumberStr(moreGameInfo.rewardNum) + "奖励");
                            StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "rewardSuccess");
                        } else {
                            moreGameInfo.tryGameTime = 0;
                            TipManager.showTip("试玩1分钟才可获得奖励哦~");
                        }
                    }
                } else {
                    if (moreGameInfo.tryGameTime != 0) {
                        if (!GameCommonUtil.isToday(moreGameInfo.tryGameTime)) {
                            moreGameInfo.tryGameTime = 0;
                            moreGameInfo.hasReward = true;
                        }
                    }
                }
            }
            MoreGameManager.reset();
            self.onShow(res);
        });
    }

    /**
     * 获取微信用户的sessionKey 和 openId
     */
    private getSessionKey(): void {
        let url = ShareManager.accessTokenUrl + '?appId=' + GameConfig.wxAppId + '&code=' + WxSDK.loginInfo.code;
        var callBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null || retData.data == null) {
                UserData.init = true;
                return;
            }
            WxSDK.loginInfo.sessionKey = retData.data.sessionKey;
            WxSDK.loginInfo.openID = retData.data.openId;
            UserData.data.openId = retData.data.openId;

            //初始化玩家的数据
            if (!UserData.init) {
                var callBack = function (retCode: number, retData2: any): void {
                    UserData.init = true;
                    if (retCode != 0) {
                        UserData.loadRemoteDataFail = true;
                    }
                    if (retCode != 0 || retData2 == null || retData2.resultCode != 0 || retData2.data == null || retData2.data.info == null) {
                        return;
                    }
                    console.log("resData info :" + retData2.data.info);
                    UserData.parseFromStr(retData2.data.info);
                }
                let url = "https://hfapi2.ttigd.cn//dataStorage-service/dataStorage/getUserInfo" + '?appId=' + GameConfig.wxAppId + '&openId=' + UserData.data.openId;
                GameCommonHttp.wxHttpGet(url, callBack);
            }
        }
        GameCommonHttp.wxHttpGet(url, callBack);
    }

    private onShow(res: any, launch: boolean = false, newPlayer: boolean = false): void {

        UserData.lastOnShowTime = Date.now();

        let self = this;

        //判断是否要上传分享图片统计
        if (this.shareTime != 0) {
            let shareIntervalTime = Date.now() - this.shareTime;
            if (shareIntervalTime >= 2000) {
                StatisticsManager.uploadSharePictureRecord(this.shareType, this.shareInfo, self.systemInfo.brand + self.systemInfo.model + self.systemInfo.system);
            }
            this.shareTime = 0;
        }

        if (res == null) {
            return;
        }

        console.log(res);

        let scene = res.scene;
        let query = res.query;

        console.log(query);

        if (launch) {

            if (query == null) {
                return;
            }
            if (!query.channelId || query.channelId == "") {
                GameConfig.currentChannelId = GameConfig.DefaultChannelId;
            } else {
                GameConfig.currentChannelId = query.channelId;
            }
        }

        if (query == null) {
            return;
        }

        //判断是否可以领取收藏奖励
        if (!UserData.data.recieveAddGameReward && AddTipConfig.rewardEvent) {
            //判断场景值是否是从我的小程序进入的
            if (scene == 1103 || scene == 1104) {
                UserData.data.recieveAddGameReward = true;
                console.log("领取添加奖收藏励");
                cc.Component.EventHandler.emitEvents([AddTipConfig.rewardEvent], null);
            }
        }

        //上传助力
        if (query.assistTargetId != null && query.assistTargetId != "" && query.assistActivityId != null) {
            var assistUrl = ShareManager.assistanceUrl + "/assist?appId=" + GameConfig.wxAppId + "&activityId=" + query.assistActivityId + "&targetId=" + query.assistTargetId + "&sourceId=" + UserData.data.playerId;
            var assistCallBack = function (retCode: number, retData: any): void {
                if (retCode != 0 || retData == null || retData.resultCode != 0) {
                    return;
                }
                StatisticsManager.thirdSendEvent(StatisticsType.assistSucc);
            }
            GameCommonHttp.wxHttpGet(assistUrl, assistCallBack);
        }

        //查询助力结果
        for (var assistId of GameConfig.assistIdArray) {
            this.assistConsume(assistId);
        }

        //上传从卡片进来的分享统计
        var sharePlayerId = query.sharePlayerId;
        if (sharePlayerId != null && sharePlayerId != UserData.data.playerId) {
            var shareType = query.shareType;
            var shareImgName = query.shareImgName;
            var shareText = query.shareText;
            var shareImgUrl = query.shareImgUrl;
            var shareTime = query.dmmShareTime;
            if (shareType != null && shareImgName != null && shareText != null && shareImgUrl != null && shareTime != null) {
                StatisticsManager.uploadClickPictureRecord(shareType, shareImgName, shareText, shareImgUrl, shareTime, this.systemInfo.brand + this.systemInfo.model + this.systemInfo.system, newPlayer);
            }
        }

        //是否是群分享功能过来的
        var shareToDifferentGroup = query.shareToDifferentGroup;
        var shareType = query.shareType;
        if (shareToDifferentGroup != null && sharePlayerId == UserData.data.playerId && shareType != null) {
            //检查是否有群id
            var shareTicket = res.shareTicket;
            if (!shareTicket) {
                wx.showModal({
                    title: "分享失败",
                    content: "分享到群才可获得奖励",
                    showCancel: false,
                    cancelText: "取消",
                    confirmText: "确定",
                    success: function (res: any): void {
                        if (res.confirm) {
                            self.shareToDifferentGroup(shareType, null);
                        }
                    }
                });
            } else {
                var callBack = (success: boolean, msg: string): void => {
                    if (success) {
                        //执行成功回调
                        var successCall = self.shareToDiffGroupCallMap.get(shareType);
                        StatisticsManager.thirdSendEvent(shareType + "获取奖励");
                        if (successCall != null) {
                            successCall();
                        }
                    } else {
                        wx.showModal({
                            title: "分享失败",
                            content: msg,
                            showCancel: false,
                            cancelText: "取消",
                            confirmText: "确定",
                            success: function (res: any): void {
                                if (res.confirm) {
                                    self.shareToDifferentGroup(shareType, null);
                                }
                            }
                        });
                    }
                }
                //检查群id是否有效
                this.checkShareToDifferentGroup(shareTicket, callBack);
            }
        }
    }

    private assistConsume(assistId: string): void {
        var consumeUrl = ShareManager.assistanceUrl + "/reward?appId=" + GameConfig.wxAppId + "&activityId=" + assistId + "&targetId=" + UserData.data.playerId;
        var consumeCallBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null || retData.data == null || retData.data.count == null) {
                return;
            }
            UserData.addAssistanceCount(assistId, retData.data.count);
        }
        GameCommonHttp.wxHttpGet(consumeUrl, consumeCallBack);
    }

    share(shareType: string, assistActivityId: string, extendInfos: Map<string, string>, callBack: (res: any, success: boolean) => void, tripleLie: boolean): void {

        var shareInfo = ShareManager.getCityShareInfo();

        if (shareInfo == null) {
            return;
        }

        this.shareTime = Date.now();
        this.shareType = shareType;
        this.shareInfo = shareInfo;

        var extendInfo = "";

        if (shareType != null) {
            extendInfo = "&shareType=" + shareType;
        }

        extendInfo = extendInfo + "&shareImgUrl=" + shareInfo.shareImgUrl;
        extendInfo = extendInfo + "&shareImgName=" + shareInfo.shareImgName;
        extendInfo = extendInfo + "&shareText=" + shareInfo.shareText;

        if (assistActivityId != null) {
            extendInfo = extendInfo + "&assistActivityId=" + assistActivityId;
            extendInfo = extendInfo + "&assistTargetId=" + UserData.data.playerId;
        }

        if (extendInfos != null) {

            extendInfos.forEach((v, k) => {
                extendInfo = extendInfo + "&" + k + "=" + v;
            });
        }

        var shareMsg = shareInfo.convertCityText;

        var shareUrl = shareInfo.shareImgUrl + "?timestate=" + this.shareTime;

        this.baseShareMsg(shareMsg, shareUrl, extendInfo);

        if (!tripleLie) {
            StatisticsManager.thirdSendEvent(shareType);
            return;
        }

        var shareCount = this.shareCountMap.has(shareType) ? this.shareCountMap.get(shareType) : 0;
        shareCount = shareCount % 3;
        if (shareCount == 0) {
            this.tempOnShowCall = () => {
                StatisticsManager.thirdSendEvent(shareType + "_第1次分享");
                this.shareCountMap.set(shareType, 1);
                if (ShareManager.getAbonormalShareControl()) {
                    TipManager.showTip("请换个群试试哦~");
                }
                callBack(null, false);
            }
        } else if (shareCount == 1) {
            this.tempOnShowCall = (res: any) => {
                StatisticsManager.thirdSendEvent(shareType + "_第2次分享");
                var intervalTime = Date.now() - this.onHideTime;
                if (intervalTime >= 3000) {
                    this.shareCountMap.set(shareType, 2);
                    StatisticsManager.thirdSendEvent(shareType + "_第2次分享成功");
                    callBack(null, true);
                } else {
                    if (ShareManager.getAbonormalShareControl()) {
                        TipManager.showTip("短时间内，不要分享同一个群");
                    }
                    callBack(null, false);
                }
            }
        } else {
            this.tempOnShowCall = (res: any) => {
                StatisticsManager.thirdSendEvent(shareType + "_第3次分享");
                var intervalTime = Date.now() - this.onHideTime;
                if (intervalTime >= 3000) {
                    this.shareCountMap.set(shareType, 0);
                    StatisticsManager.thirdSendEvent(shareType + "_第3次分享成功");
                    callBack(null, true);
                } else {
                    if (ShareManager.getAbonormalShareControl()) {
                        TipManager.showTip("短时间内，不要分享同一个群");
                    }
                    callBack(null, false);
                }
            }
        }
    }

    /**
     * 分级分享（失败后通用组件不做提示，提示逻辑自己写）
     * （1）新玩家（分享成功 0 - 20 次）
     * 分享成功：2 秒内返回失败、2 秒后返回成功；
     * （2）中等玩家（分享成功 21 - 60 次）
     * 第 1 - 4 次分享：3 秒内返回失败、3 秒后返回成功；
     * 第 5 次分享及以后：2 秒内返回失败、2 秒后返回成功；
     * （3）老玩家（分享成功 60 次）
     * 第 1 - 4 次分享：5 秒内返回失败、5 秒后返回成功；
     * 第 5 次分享及以后：2 秒内返回失败、2 秒后返回成功；
     * 
     * @param shareType 分享类型
     * @param callBack: (success: boolean, cancel: boolean) => void
     */
    levelShare(shareType: string, callBack: (success: boolean, cancel: boolean) => void): void {

        var shareInfo = ShareManager.getCityShareInfo();

        if (shareInfo == null) {
            return;
        }

        this.shareTime = Date.now();
        this.shareType = shareType;
        this.shareInfo = shareInfo;

        var extendInfo = "";

        if (shareType != null) {
            extendInfo = "&shareType=" + shareType;
        }

        extendInfo = extendInfo + "&shareImgUrl=" + shareInfo.shareImgUrl;
        extendInfo = extendInfo + "&shareImgName=" + shareInfo.shareImgName;
        extendInfo = extendInfo + "&shareText=" + shareInfo.shareText;

        var shareMsg = shareInfo.convertCityText;

        var shareUrl = shareInfo.shareImgUrl + "?timestate=" + this.shareTime;

        this.baseShareMsg(shareMsg, shareUrl, extendInfo);

        if (!ShareManager.getAbonormalShareControl()) {
            this.tempOnShowCall = () => {
                callBack(true, true);
            }
            return;
        }

        this.tempOnShowCall = (res: any) => {
            let succ = false;
            let intervalTime = Date.now() - this.onHideTime;
            let succCount = UserData.data.levelShareSuccCount;
            if (intervalTime >= 2000) {
                if (succCount < 2) {
                    succ = true;
                } else if (succCount < 5) {
                    succ = this.levelShareFailCount >= 4 || intervalTime >= 3000;
                } else {
                    succ = this.levelShareFailCount >= 4 || intervalTime >= 5000;
                }
            }
            if (succ) {
                UserData.data.levelShareSuccCount++;
                this.levelShareFailCount = 0;
                StatisticsManager.thirdSendEvent(shareType + "分享成功");
                callBack(true, true);
            } else {
                this.levelShareFailCount++;
                StatisticsManager.thirdSendEvent(shareType + "分享失败");
                callBack(false, true);
            }
        }
    }

    clearTripleLie(shareType: string): void {
        if (shareType == null) {
            return;
        }
        this.shareCountMap.delete(shareType);
    }

    private baseShareMsg(title: string, imageUrl: string, queryParam: string): void {

        let shareAppMessageParam = {

            title: title,

            imageUrl: imageUrl,

            query: this.getQueryParam(queryParam)
        };

        if (GameGlobal && GameGlobal.tdAppSdk && typeof GameGlobal.tdAppSdk.share === 'function') {
            GameGlobal.tdAppSdk.share({
                title: title,
                path: imageUrl
            });
        }

        if (typeof wx.aldShareAppMessage !== 'function') {
            wx.shareAppMessage(shareAppMessageParam);
            return;
        }

        wx.aldShareAppMessage(shareAppMessageParam);
    }

    private getQueryParam(param: string) {

        var queryParam = "sharePlayerId=" + UserData.data.playerId + "&channelId=" + GameConfig.DefaultChannelId + "&dmmShareTime=" + this.shareTime;

        if (UserData.data.weixinadinfo != null) {
            queryParam = queryParam + "&weixinadinfo=" + UserData.data.weixinadinfo;
            queryParam = queryParam + "&adChannel=" + UserData.data.adChannel;
        }

        if (UserData.data.sourceAppId != null) {
            queryParam = queryParam + "&dmmOutChannel=" + UserData.data.sourceAppId;
        }

        if (param != null) {
            queryParam = queryParam + "&" + param;
        }

        return queryParam;
    }

    shareToDifferentGroup(shareType: string, extendInfos: Map<string, string>): void {

        var shareInfo = ShareManager.getCityShareInfo();

        if (shareInfo == null) {
            return;
        }

        this.shareTime = Date.now();
        this.shareType = shareType;
        this.shareInfo = shareInfo;

        var extendInfo = "";

        if (shareType != null) {
            extendInfo = "&shareType=" + shareType;
        }

        extendInfo = extendInfo + "&shareImgUrl=" + shareInfo.shareImgUrl;
        extendInfo = extendInfo + "&shareImgName=" + shareInfo.shareImgName;
        extendInfo = extendInfo + "&shareText=" + shareInfo.shareText;
        extendInfo = extendInfo + "&shareToDifferentGroup=true";

        if (extendInfos != null) {

            extendInfos.forEach((v, k) => {
                extendInfo = extendInfo + "&" + k + "=" + v;
            });
        }

        var shareMsg = shareInfo.convertCityText;

        var shareUrl = shareInfo.shareImgUrl + "?timestate=" + Date.now();

        this.baseShareMsg(shareMsg, shareUrl, extendInfo);

        this.tempOnShowCall = () => {
            TipManager.showToast("分享到群<br/>自己进群点卡片即可获得");
        }
    }

    addShareToDiffSuccessCall(shareType: string, successCall: () => void): void {
        if (shareType == null || successCall == null) {
            return;
        }
        this.shareToDiffGroupCallMap.set(shareType, successCall);
    }

    //判断分享到的群在今天是否重复
    private checkShareToDifferentGroup(shareTicket, callback: (success: boolean, msg: string) => void) {
        if (shareTicket == null) {
            if (callback) {
                callback(false, "请换个群试试吧");
            }
        }

        let self = this;
        wx.getShareInfo({
            shareTicket: shareTicket,
            success: function (res) {
                console.log("获取分享群数据");
                console.log(res);
                let encryptedData = res.encryptedData;
                let iv = res.iv;
                self.decodeShareTicket(encryptedData, iv, callback);
            },

            fail: function () {
                if (callback) {
                    callback(false, "请换个群试试吧");
                }
            },
        })
    }

    //解码shareticket
    private decodeShareTicket(encryptedData, iv, callback: (success: boolean, msg: string) => void) {
        const data = WxSDK.decryData(encryptedData, iv);
        console.log("share ticket 解码后数据");
        console.log(data);

        if (!data) {
            if (callback) {
                callback(false, "请换个群试试吧");
                return;
            }
        }

        let openGId = data.openGId;
        let date = new Date();
        let key = "oneDayGroupShareData" + date.toDateString();
        let todaySharedGroupJson = this.getStorage(key);

        try {
            //今天还没有分享过群
            if (!todaySharedGroupJson || todaySharedGroupJson == "") {
                console.log("今天还没有分享过群");
                let groupIdArray = [];
                groupIdArray.push(openGId);
                var jsonText = JSON.stringify(groupIdArray);
                this.setStorage(key, jsonText);
                if (callback) {
                    callback(true, null);
                }
            } else {
                console.log("todaySharedGroupJson : " + todaySharedGroupJson);
                let todaySharedGroup = JSON.parse(todaySharedGroupJson);

                for (let groupId of todaySharedGroup) {
                    if (groupId == openGId) {
                        if (callback) {
                            callback(false, "同一个群一天只能分享一次");
                        }
                        console.log("今天已经分享过到这个群了");
                        return;
                    }
                }
                console.log(todaySharedGroup.length);
                console.log("今天还没有分享过这个群");
                todaySharedGroup.push(openGId);
                var todaySharedGroupJsonText = JSON.stringify(todaySharedGroup);
                this.setStorage(key, todaySharedGroupJsonText);
                if (callback) {
                    callback(true, null);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    private static decryData(encryptedData: any, iv: any): any {
        // base64 decode
        var sessionKey = new Buffer(WxSDK.loginInfo.sessionKey, 'base64');
        encryptedData = new Buffer(encryptedData, 'base64');
        iv = new Buffer(iv, 'base64');
        try {
            // 解密
            var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true)
            var decoded = decipher.update(encryptedData, 'binary', 'utf8')
            decoded += decipher.final('utf8')
            decoded = JSON.parse(decoded)
        } catch (err) {
            console.error(err);
        }

        if (decoded.watermark.appid !== GameConfig.wxAppId) {
            console.error('Illegal Buffer');
        }

        return decoded;
    }

    isPhoneXScreen(): boolean {

        if (this.systemInfo == null) {
            return false;
        }

        var width = this.systemInfo.screenWidth;
        var height = this.systemInfo.screenHeight;

        return width / height > 2 || height / width > 2
    }

    showWxModal(title: string, content: string, confirmAction: () => void, cancelAction: () => void): void {
        wx.showModal({
            title: title,
            content: content,
            showCancel: cancelAction != null,
            cancelText: "取消",
            confirmText: "确定",
            success: function (res: any): void {
                if (res.confirm && confirmAction) {
                    confirmAction();
                }
                if (res.cancel && cancelAction) {
                    cancelAction();
                }
            }
        });
    }

    getMenuButtonBoundingClientRect(): any {
        if (typeof (wx.getMenuButtonBoundingClientRect) !== "function") {
            return null;
        }
        return wx.getMenuButtonBoundingClientRect();
    }

    showWxLoading(title: string, callBack: any, delayTime: number): void {

        if (typeof (wx.showLoading) !== "function") {
            return;
        }

        wx.showLoading({
            title: title,
        });

        setTimeout(function () {
            wx.hideLoading();
            if (callBack != null) {
                callBack();
            }
        }, delayTime);
    }

    private wxGetSystemInfo(): void {
        var self = this;
        let failCount = 0;
        let call = () => {
            wx.getSystemInfo({
                success(systemInfo) {
                    console.log(systemInfo);
                    self.systemInfo.platform = systemInfo.platform;
                    self.systemInfo.system = systemInfo.system;
                    self.systemInfo.brand = systemInfo.brand;
                    self.systemInfo.model = systemInfo.model;
                    self.systemInfo.screenWidth = systemInfo.screenWidth;
                    self.systemInfo.screenHeight = systemInfo.screenHeight;
                    self.systemInfo.windowWidth = systemInfo.windowWidth;
                    self.systemInfo.windowHeight = systemInfo.windowHeight;
                    self.systemInfo.benchmarkLevel = systemInfo.benchmarkLevel;
                    self.systemInfo.wechatVersion = systemInfo.version;
                    self.systemInfo.SDKVersion = systemInfo.SDKVersion;
                    self.systemInfo.pixelRatio = systemInfo.pixelRatio;
                },
                fail() {
                    failCount++;
                    //限制最多失败5次后不再调用
                    if (failCount >= 5) {
                        console.error("wx.getSystemInfo fail 5");
                        return;
                    } else {
                        call();
                    }
                }
            });
        };
        call();
    }

    public static loginInfo: {
        encryptedData: string,
        signature: string,
        iv: string,
        rawData: string,
        code: string,
        sessionKey: string,
        openID: string,
    } = {
            encryptedData: null,
            signature: null,
            iv: null,
            rawData: null,
            code: null,
            sessionKey: null,
            openID: null,
        };
}

export class SystemInfo {
    public platform: string;
    public system: string;//操作系统版本
    public brand: string;//手机品牌
    public model: string;//手机型号
    public screenWidth: number = 0;
    public screenHeight: number = 0;
    public windowWidth: number = 0;
    public windowHeight: number = 0;
    public benchmarkLevel: number = 0;
    public wechatVersion: string;
    public SDKVersion: string;
    public pixelRatio: number = 0;
}
