import { GameCommonPool } from "../GameCommon/GameCommonPool";

const { ccclass, property } = cc._decorator;

@ccclass
export class AddWxSmallGameConf extends cc.Component {

    @property({
        type: cc.SpriteFrame,
        displayName: "游戏icon"
    })
    protected gameIcon: cc.SpriteFrame = null;

    @property({
        type: cc.SpriteFrame,
        displayName: "游戏奖励图片"
    })
    protected rewardIcon: cc.SpriteFrame = null;

    @property({
        displayName: "游戏简称",
    })
    protected gameName: string = '';

    @property({
        type: cc.Component.EventHandler,
        displayName: "收藏奖励"
    })
    protected rewardEvent: cc.Component.EventHandler = null;

    @property({
        type: cc.Prefab,
        displayName: "添加提示预设"
    })
    protected addGameTip: cc.Prefab = null;

    @property({
        type: cc.Node,
        displayName: "弹出框父节点"
    })
    protected popNode: cc.Node = null;

    onLoad(): void {
        AddTipConfig.gameIcon = this.gameIcon;
        AddTipConfig.rewardIcon = this.rewardIcon;
        AddTipConfig.gameName = this.gameName;
        AddTipConfig.hasReward = this.rewardEvent != null;
        AddTipConfig.rewardEvent = this.rewardEvent;
    }

    onEnable(): void {
        this.node.stopAllActions();
        this.node.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(1, -25),
            cc.rotateTo(1, 0),
            cc.rotateTo(1, 25),
            cc.rotateTo(1, 0),
        )));
    }

    private clickAddTip(): void {
        if (!this.addGameTip || !this.popNode) {
            return;
        }
        let instance = GameCommonPool.requestInstant(this.addGameTip);
        if (instance) {
            instance.setParent(this.popNode);
        }
    }
}

export class AddTipConfig {
    public static gameIcon: cc.SpriteFrame = null;
    public static rewardIcon: cc.SpriteFrame = null;
    public static gameName: string = null;
    public static hasReward: boolean = false;
    public static rewardEvent: cc.Component.EventHandler = null;
}
