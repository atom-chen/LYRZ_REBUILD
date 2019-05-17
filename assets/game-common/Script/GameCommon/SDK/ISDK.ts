import { SystemInfo } from "./WxSDK";

export interface ISDK {

    /**
     * 微信跳转其他小游戏
     * @param jumpAppId 跳转的小游戏appId
     * @param jumpPath 跳转其他小游戏传入的参数
     * @param callBack 跳转成功后的回调
     */
    navigateToMiniProgram(jumpAppId: string, jumpPath: string, callBack?: (success: boolean) => void): void;

    /**
     * 保存数据到微信中
     * @param storageKey 本地缓存中指定的 key
     * @param storageData 需要被保存的数据，暂定只保存string
     */
    setStorage(storageKey: string, storageData: string): void;

    /**
     * 从微信中获取数据
     * @param storageKey 本地缓存中指定的 key 
     */
    getStorage(storageKey: string): string;

    /**
     * 微信短震动
     */
    vibrateShort(): void;

    /**
     * 微信短震动
     */
    vibrateLong(): void;

    /**
     * 获取微信启动参数
     * @return launchOption
     */
    getLaunchOptions(): any;

    /**
     * 注册微信游戏onShow事件,launch不会触发onShow回调
     * @param callBack 
     */
    registerOnShow(callBack: (res: any) => void): void;

    /**
     * 注册微信游戏隐藏事件
     * @param callBack 
     */
    registerOnHide(callBack: () => void): void;

    /**
     * 微信登录
     */
    login(): void;

    /**
     * 初始化微信数据，需要在第一个场景的onLoad中初始化
     */
    wxInitData(): void;

    /**
     * 游戏启动，确保最多只执行一次
     */
    appGameOnLanch(): void;

    /**
     * 普通分享
     * @param shareType 分享类型，主要用于分享图片统计以及分享事件，会根据type分别统计点击分享、分享到单人、分享到群、分享失败四种
     * @param assistActivityId 助力活动的id，主要拥有不同的助力活动
     * @param extendInfos 分享的卡片中需要配置的参数，以map传入key value
     * @param callBack 分享回调
     * @param tripleLie 是否开启分享三连骗的功能，默认不开启
     */
    share(shareType: string, assistActivityId: string, extendInfos: Map<string, string>, callBack: (res: any, success: boolean) => void, tripleLie?: boolean): void;

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
    levelShare(shareType: string, callBack: (success: boolean, cancel: boolean) => void): void;

    /**
     * 分享到不同的群 
     * @param shareType 分享类型，
     * @param extendInfos 分享的卡片中需要配置的参数，以map传入key value
     */
    shareToDifferentGroup(shareType: string, extendInfos: Map<string, string>): void;

    addShareToDiffSuccessCall(shareType: string, successCall: () => void): void;

    /**
     * 清空指定分享的记录次数
     * @param shareType 
     */
    clearTripleLie(shareType: string): void;

    /**
     * 手机屏幕是否是iPhoneX的分辨率
     */
    isPhoneXScreen(): boolean;

    getSystemInfo(): SystemInfo;

    /**
     * 微信预览图片
     * @param url 需要展示单张图片的url
     * @param urls 需要展示一组图片的url数组
     */
    previewImage(url?: string, urls?: Array<string>): void;

    /**
     * 显示微信意见反馈按钮
     * @param left 左上角横坐标
     * @param top 左上角纵坐标
     * @param 投诉图片的在resource文件下的位置
     */
    showFeedbackButton(left: number, top: number, imagePath: string): void;

    /**
     * 销毁微信意见反馈按钮
     */
    destroyFeedbackButton(): void;

    /**
     * 展示微信的模态对话框
     * @param title 对话框标题
     * @param content 对话框内容
     * @param confirmAction: () => void 点击确定后执行的回调
     * @param cancelAction: () => void 点击取消后执行的回调，若设置为null则对话框不显示取消按钮
     */
    showWxModal(title: string, content: string, confirmAction: () => void, cancelAction: () => void): void;

    /**
     * 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
     */
    getMenuButtonBoundingClientRect(): any;

    /**
     * 显示假的微信loading提示框，在设置的时间后关闭提示框
     * @param title 提示的内容
     * @param callBack 关闭loading提示框后的回调方法
     * @param delayTime 延迟关闭的时间 单位毫秒
     */
    showWxLoading(title: string, callBack: any, delayTime: number): void;
}