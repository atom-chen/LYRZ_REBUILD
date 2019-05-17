import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { DayliLoginItemData, DayliLogin } from "./DayliLogin";
import { UserData } from "../GameCommon/UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export class DayliLoginManager extends cc.Component {

    protected static instance: DayliLoginManager = null;

    @property({
        type: cc.Prefab,
        displayName: "每日登录界面"
    })
    protected dayliLoginprefab: cc.Prefab = null;

    @property({
        displayName: "开启循环登陆奖励"
    })
    protected loopReward: boolean = true;

    protected dayliLogin: DayliLogin = null;

    onLoad(): void {
        DayliLoginManager.instance = this;
    }

    /**
     * 是否开启循环每日登录奖励
     */
    public static isLoopReward(): boolean {
        let manager = this.instance;
        if (manager == null) {
            return false;
        }
        return manager.loopReward;
    }

    /**
     * 显示7日登陆奖励界面
     * @param itemDatas 签到奖励元素数组
     * @param clickRecieveAction 点击领取按钮的回调方法，请确保成功领取后再调用传入的successCall
     */
    public static showDayliLogin(itemDatas: Array<DayliLoginItemData>, clickRecieveAction: (itemData: DayliLoginItemData, isDoubble: boolean, successCall: () => void) => void): void {

        let manager = this.instance;
        if (manager == null || manager.dayliLoginprefab == null) {
            return;
        }

        let loginRewardRecievedCount = UserData.data.loginRewardRecievedCount;
        let loginRewardCanRecieveCount = UserData.data.loginRewardCanRecieveCount;

        if (manager.loopReward) {
            if (loginRewardCanRecieveCount > 7 && loginRewardRecievedCount >= 7) {
                UserData.data.loginRewardRecievedCount %= 7;
                UserData.data.loginRewardCanRecieveCount %= 7;
                loginRewardRecievedCount = UserData.data.loginRewardRecievedCount;
                loginRewardCanRecieveCount = UserData.data.loginRewardCanRecieveCount;
            }
        }

        if (manager.dayliLogin != null) {
            manager.dayliLogin.node.active = true;
            manager.dayliLogin.bindData(loginRewardRecievedCount, loginRewardCanRecieveCount, itemDatas, clickRecieveAction);
            return;
        }
        let instant = GameCommonPool.requestInstant(manager.dayliLoginprefab);
        if (instant == null) {
            return;
        }
        instant.setParent(manager.node);
        let dayliLogin = instant.getComponent(DayliLogin);
        if (dayliLogin == null) {
            return;
        }
        dayliLogin.bindData(loginRewardRecievedCount, loginRewardCanRecieveCount, itemDatas, clickRecieveAction);
        manager.dayliLogin = dayliLogin;
    }

    /**
     * 签到界面是否弹出
     */
    public static isShow(): boolean {
        let manager = this.instance;
        if (manager == null || manager.dayliLogin == null) {
            return false;
        }

        return manager.dayliLogin.node.active;
    }
}
