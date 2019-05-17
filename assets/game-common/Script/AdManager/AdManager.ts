import { TipManager } from "../Tip/TipManager";
import { GameCommon, GameConfig } from "../GameCommon/GameCommon";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { ShareManager } from "../ShareCommon/ShareManager";

export class AdManager {

    private static videoAd: any = null;

    private static videoState: number = 1;//-1代表客户端版本不支持，0代表成功拉取广告，1代表广告正在准备中, 2代表广告拉取失败

    private static endCallBack: () => void = null;//播放视频正常结束回调

    private static closeCallBack: () => void = null;//播放视频中断回调

    private static tryLoadAdCount: number = 0;//尝试获取视频的次数，超过5次后不再尝试
    private static tryLoadBannerAdCount: number = 0;//尝试获取Banner的次数，超过5次后不再尝试

    private static wxBannerAd: any = null;

    public static bannerAdShow: boolean = false;//bannerAd是否展示中

    private static bannerAdLoading: boolean = false;//bannerAd是否加载中

    public static videoAdShow: boolean = false;//veidoAd是否展示中

    private static videoStartTime: number = null;//观看视频的开始时间

    /**
     * 初始化加载视频广告
     */
    public static initVideoAd(): void {

        if (!GameCommon.isWechat() || GameConfig.videoAdUnitId == null) {
            this.videoState = -1;
            return;
        }

        var self = this;

        if (wx == null || wx.createRewardedVideoAd == null || typeof wx.createRewardedVideoAd !== 'function') {
            this.videoState = -1;
            return;
        }

        this.videoAd = wx.createRewardedVideoAd({ adUnitId: GameConfig.videoAdUnitId });

        if (!this.videoAd) {
            return;
        }

        this.videoAd.onLoad(function () {
            self.videoState = 0;
            self.tryLoadAdCount = 0;
        });

        this.videoAd.onError(function (err) {
            console.error(err);
            //加载出错后重新加载视频
            self.loadVideoAd();
        });

        this.videoAd.onClose(function (res) {
            self.videoAdShow = false;
            let interval = self.videoStartTime ? ((Date.now() - self.videoStartTime) / 1000).toFixed(2) : 0;
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                StatisticsManager.thirdSendEvent("观看完整视频", "end_watch_video", { "时间": interval });
                // 正常播放结束，可以下发游戏奖励
                if (self.endCallBack != null) {
                    self.endCallBack();
                }
            } else {
                StatisticsManager.thirdSendEvent("取消观看视频", "cancel_watch_video", { "时间": interval });
                // 播放中途退出，不下发游戏奖励
                if (self.closeCallBack != null) {
                    self.closeCallBack();
                }
            }
        });
    }

    /**
     * 视频广告加载失败后重新加载，一次调用最多加载5次，失败5次以上不再加载
     */
    private static loadVideoAd(): void {

        if (this.tryLoadAdCount >= 5) {
            this.tryLoadAdCount = 0;
            this.videoState = 2;
            return;
        }

        this.tryLoadAdCount++;
        this.videoState = 1;

        if (this.videoAd != null) {
            this.videoAd.load();
        }
    }

    /**
     * 显示视频广告
     * @param endCallBack 播放视频正常结束回调
     * @param closeCallBack 播放视频中断或者提前关闭回调
     */
    public static showVideoAd(endCallBack: () => void, closeCallBack: () => void) {

        StatisticsManager.thirdSendEvent("点击播放视频", "click_watch_video");
        //不支持视频广告
        if (this.videoState == -1) {
            TipManager.showTip("当前微信版本不支持播放视频哦~快去升级吧~");
            return;
        }

        //视频广告正在加载
        if (this.videoState == 1) {
            TipManager.showTip("啊呀，视频还没送达，等一下再试试吧~");
            return;
        }

        //视频广告加载失败，重新加载
        if (this.videoState == 2) {
            TipManager.showTip("啊呀，视频还没送达，等一下再试试吧~");
            this.loadVideoAd();
            return;
        }

        if (this.videoAd == null) {
            return;
        }

        this.endCallBack = endCallBack;
        this.closeCallBack = closeCallBack;
        this.videoStartTime = Date.now();
        this.videoAd.show();
        this.videoAdShow = true;
        this.videoState = 1;
    }

    /**
     * @return boolean 是否有视频广告可以播放
     */
    public static hasVideoAd(): boolean {
        if (this.videoState == -1) {
            return false;
        }

        if (this.videoState == 1) {
            return false;
        }

        if (this.videoState == 2) {
            return false;
        }

        if (this.videoAd == null) {
            return false;
        }

        return true;
    }

    /**
     * 预加载banner广告
     * 参数和showBannerAd相同，只加载不显示，显示时请调用showOldBannerAd
     */
    public static preLoadBannerAd(left: number, top: number, width: number, wxBannerAdUnitId: string = GameConfig.bannerAdUnitId, onResizeCall: (wxBannerAd: any) => void = null): void {

        if (!ShareManager.getBannerAdControl()) {
            return;
        }

        if (!GameCommon.isWechat() || typeof wx.createBannerAd !== 'function' || wxBannerAdUnitId == null) {
            return;
        }

        //视频广告播放时不允许加载banner广告
        if (this.videoAdShow) {
            return;
        }

        if (this.tryLoadBannerAdCount >= 5) {
            this.tryLoadBannerAdCount = 0;
            return;
        }
        this.tryLoadBannerAdCount++;

        this.bannerAdLoading = true;
        var wxBannerAd = wx.createBannerAd({
            adUnitId: wxBannerAdUnitId,
            style: {
                left: left,
                top: top,
                width: width,
            }
        });
        wxBannerAd.onResize(function () {
            if (onResizeCall != null) {
                onResizeCall(wxBannerAd);
            }
        });
        wxBannerAd.onError((err) => {
            console.error(err);
            wxBannerAd.destroy();
            if (!this.bannerAdLoading) {
                this.tryLoadBannerAdCount = 0;
                return;
            }
            if (AdManager.wxBannerAd != null) {
                this.bannerAdShow = true;
                this.bannerAdLoading = false;
                this.tryLoadBannerAdCount = 0;
                return;
            }
            AdManager.preLoadBannerAd(left, top, width, wxBannerAdUnitId);
        });
        wxBannerAd.onLoad(() => {
            //只允许存在一个banner广告，需要销毁旧的banner
            if (AdManager.wxBannerAd != null) {
                AdManager.wxBannerAd.destroy();
            }
            AdManager.wxBannerAd = wxBannerAd;
            if (!this.bannerAdLoading) {
                return;
            }
            this.tryLoadBannerAdCount = 0;
            this.bannerAdLoading = false;
        });
    }

    public static showPreBannerAd(): void {

        //视频广告播放时不允许加载banner广告
        if (this.videoAdShow) {
            return;
        }

        if (this.wxBannerAd) {
            this.wxBannerAd.show();
            this.bannerAdShow = true;
        }
    }

    /**
     * 显示旧的banner广告
     * 参数和showBannerAd相同，在没有旧的banner广告下会调用showBannerAd创建新的banner
     */
    public static showOldBannerAd(left: number, top: number, width: number, wxBannerAdUnitId: string = GameConfig.bannerAdUnitId, onResizeCall: (wxBannerAd: any) => void = null): void {

        if (!GameCommon.isWechat() || typeof wx.createBannerAd !== 'function' || wxBannerAdUnitId == null) {
            return;
        }

        //视频广告播放时不允许加载banner广告
        if (this.videoAdShow) {
            return;
        }

        if (this.wxBannerAd) {
            this.wxBannerAd.show();
            this.bannerAdShow = true;
            return;
        }

        this.showBannerAd(left, top, width, wxBannerAdUnitId, onResizeCall);
    }

    /**
     * 显示banner广告
     * @param left banner 广告组件的左上角横坐标
     * @param top banner 广告组件的左上角纵坐标
     * @param width banner 广告组件的宽度 Banner 广告组件的尺寸会根据设置的宽度进行等比缩放，缩放的范围是 300 到 屏幕宽度。屏幕宽度是以逻辑像素为单位的宽度,WxSDK.systemInfo.screenWidth
     * @param wxBannerAdUnitId 可以不传入，默认使用GameCommon中设置的bannerId,仅在需要使用其他bannerId时传入
     * @param onResizeCall 可以不传入，监听banner 广告尺寸变化事件后的回调方法，可在回调中动态设置banner的位置和大小
     */
    public static showBannerAd(left: number, top: number, width: number, wxBannerAdUnitId: string = GameConfig.bannerAdUnitId, onResizeCall: (wxBannerAd: any) => void = null): void {

        if (!ShareManager.getBannerAdControl()) {
            return;
        }

        if (!GameCommon.isWechat() || typeof wx.createBannerAd !== 'function' || wxBannerAdUnitId == null) {
            return;
        }

        //视频广告播放时不允许加载banner广告
        if (this.videoAdShow) {
            return;
        }

        if (this.tryLoadBannerAdCount >= 5) {
            this.tryLoadBannerAdCount = 0;
            return;
        }
        this.tryLoadBannerAdCount++;

        if (this.wxBannerAd) {
            this.wxBannerAd.show();
        }

        this.bannerAdLoading = true;
        var wxBannerAd = wx.createBannerAd({
            adUnitId: wxBannerAdUnitId,
            style: {
                left: left,
                top: top,
                width: width,
            }
        });
        wxBannerAd.onResize(function () {
            if (onResizeCall != null) {
                onResizeCall(wxBannerAd);
            }
        });
        wxBannerAd.onError((err) => {
            console.error(err);
            wxBannerAd.destroy();
            if (!this.bannerAdLoading) {
                this.tryLoadBannerAdCount = 0;
                return;
            }
            if (AdManager.wxBannerAd != null) {
                this.bannerAdShow = true;
                this.bannerAdLoading = false;
                this.tryLoadBannerAdCount = 0;
                return;
            }
            AdManager.showBannerAd(left, top, width, wxBannerAdUnitId);
        });
        wxBannerAd.onLoad(() => {
            //只允许存在一个banner广告，需要销毁旧的banner
            if (AdManager.wxBannerAd != null) {
                AdManager.wxBannerAd.destroy();
            }
            AdManager.wxBannerAd = wxBannerAd;
            if (!this.bannerAdLoading) {
                return;
            }
            this.tryLoadBannerAdCount = 0;
            wxBannerAd.show();
            this.bannerAdShow = true;
            this.bannerAdLoading = false;
        });
    }

    /**
     * 隐藏banner广告
     * @param destory 是否销毁广告，不销毁下次可以立即显示出来
     */
    public static hideBannerAd(destory: boolean = false): void {
        this.bannerAdShow = false;
        this.bannerAdLoading = false;
        if (this.wxBannerAd == null) {
            return;
        }
        this.wxBannerAd.hide();
        if (destory) {
            this.wxBannerAd.destroy();
            this.wxBannerAd = null;
        }
    }
}