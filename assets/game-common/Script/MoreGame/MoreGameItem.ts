import { MoreGameInfo } from "./MoreGameManager";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class MoreGameItem extends cc.Component {

    @property(cc.RichText)
    protected gameName: cc.RichText = null;

    @property(cc.RichText)
    protected reward: cc.RichText = null;

    @property(cc.Sprite)
    protected gameIcon: cc.Sprite = null;

    @property(cc.Node)
    protected redPoint: cc.Node = null;

    protected clickAction: (moreGameInfo: MoreGameInfo) => void = null;

    protected moreGameInfo: MoreGameInfo = null;

    public bindData(moreGameInfo: MoreGameInfo, clickAction: (moreGameInfo: MoreGameInfo) => void): void {
        if (moreGameInfo == null) {
            return;
        }
        this.gameName.string = "<color=#666600><b>" + moreGameInfo.gameName + "</b></c>";
        console.log(this.gameName.string);
        var self = this;
        this.gameIcon.spriteFrame = null;
        cc.loader.load({ url: moreGameInfo.gameIconUrl, type: "png" }, function (error, texture) {
            if (texture == null) {
                return;
            }
            self.gameIcon.spriteFrame = new cc.SpriteFrame(texture);
        });
        this.redPoint.active = moreGameInfo.redPoint;
        this.clickAction = clickAction;
        this.moreGameInfo = moreGameInfo;
        this.refreshReward();
    }

    public refreshReward(): void {
        if (this.moreGameInfo.hasReward) {
            var rewardCountStr = GameCommonUtil.getShotNumberStr(this.moreGameInfo.rewardNum);
            this.reward.string = "<color=#666600><b>+ " + rewardCountStr + "</b></c>";
        } else {
            this.reward.string = "<color=#666600><b>已领取</b></c>";
        }
    }

    protected clickItem(): void {
        if (this.clickAction != null) {
            this.clickAction(this.moreGameInfo);
        }
    }
}
