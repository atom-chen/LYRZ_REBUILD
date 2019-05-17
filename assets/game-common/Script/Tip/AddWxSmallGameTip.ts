import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { AddTipConfig } from "./AddWxSmallGameConf";

const { ccclass, property } = cc._decorator;

@ccclass
export class AddWxSmallGameTip extends cc.Component {

    @property(cc.RichText)
    protected tip4: cc.RichText = null;

    @property(cc.Sprite)
    protected gameIcon1: cc.Sprite = null;

    @property(cc.Label)
    protected gameName1: cc.Label = null;

    @property(cc.Sprite)
    protected gameIcon2: cc.Sprite = null;

    @property(cc.Label)
    protected gameName2: cc.Label = null;

    @property(cc.Node)
    protected rewardTitle: cc.Node = null;

    @property(cc.Sprite)
    protected rewardIcon: cc.Sprite = null;

    @property(cc.Node)
    protected board: cc.Node = null;

    onLoad(): void {
        this.tip4.string = "<color=#1e1e1e>点击我的小程序</color><color=#ff2828> “" + AddTipConfig.gameName + "” </color><color=#1e1e1e>进入游戏即可获得奖励！</color><br/><color=#1e1e1e>（如右图）</color>";
        this.gameName1.string = this.gameName2.string = AddTipConfig.gameName;
        this.gameIcon1.spriteFrame = this.gameIcon2.spriteFrame = AddTipConfig.gameIcon;
        this.rewardIcon.spriteFrame = AddTipConfig.rewardIcon;
        this.rewardTitle.active = AddTipConfig.hasReward;
    }

    onEnable(): void {
        this.board.stopAllActions();
        this.board.scale = 0;
        this.board.opacity = 0;
        this.board.runAction(cc.spawn(cc.scaleTo(0.25, 1), cc.fadeIn(0.25)));
    }

    protected clickClose(): void {
        GameCommonPool.returnInstant(this.node);
    }
}
