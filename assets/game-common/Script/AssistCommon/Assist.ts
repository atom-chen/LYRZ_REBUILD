import { ShareManager } from "../ShareCommon/ShareManager";
import { UserData } from "../GameCommon/UserData";
import { AdManager } from "../AdManager/AdManager";
import { StatisticsManager, StatisticsType } from "../StatisticsManager/StatisticsManager";
import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { TipManager } from "../Tip/TipManager";
import { GameConfig } from "../GameCommon/GameCommon";

const { ccclass, property } = cc._decorator;

@ccclass
export class Assist extends cc.Component {

    protected static ActivityId: string = "assist";

    @property([cc.Node])
    protected assistedIconArray: cc.Node[] = new Array();

    @property(cc.Node)
    protected closeNode: cc.Node = null;

    @property(cc.Node)
    protected bg: cc.Node = null;

    @property(cc.Node)
    protected board: cc.Node = null;

    protected originalPosition: cc.Vec2 = null;

    protected originalWidth: number = 0;

    protected show: boolean = false;

    onLoad(): void {
        this.originalPosition = this.board.position.clone();
        this.originalWidth = this.board.width;
    }

    onEnable(): void {
        var self = this;
        var consumeUrl = ShareManager.assistanceUrl + "/reward?appId=" + GameConfig.wxAppId + "&activityId=" + Assist.ActivityId + "&targetId=" + UserData.data.playerId;
        var consumeCallBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null) {
                return;
            }
            if (retData.data == null || retData.data.count == null) {
                return;
            }
            UserData.addAssistanceCount(Assist.ActivityId, retData.data.count);
            self.refresh();
        }
        GameCommonHttp.wxHttpGet(consumeUrl, consumeCallBack);

        this.refresh();

        this.board.x -= this.originalWidth;
        this.showMoreGame();

        if (!AdManager.bannerAdShow) {
            // AdManager.createBannerAd(AdManager.wxBannerAdUnitId);
        }
    }

    protected refresh(): void {
        for (let index = 0; index < this.assistedIconArray.length; index++) {
            var assistedIcon = this.assistedIconArray[index];
            if (assistedIcon != null) {
                assistedIcon.active = UserData.getAssistanceCount(Assist.ActivityId) > index;
            }
        }
    }

    protected assistInvite(): void {
        StatisticsManager.thirdSendEvent(StatisticsType.assistInvite);
        var shareCallBack = function (success: boolean): void {
            if (success) {
                StatisticsManager.thirdSendEvent(StatisticsType.assistSuccInvite);
            } else {
                StatisticsManager.thirdSendEvent(StatisticsType.assistCancelInvite);
            }
            TipManager.showTip("好友点击后才可获得加成哦~");
        }
        window.gameCommon.getSDK.share(StatisticsType.assistShare, Assist.ActivityId, null, shareCallBack);
    }

    protected showMoreGame(): void {
        if (this.show) {
            return;
        }
        this.closeNode.opacity = 0;
        this.show = true;
        var self = this;
        this.board.runAction(cc.sequence(
            cc.moveTo(0.5, this.originalPosition).easing(cc.easeQuarticActionOut()),
            cc.callFunc(function () {
                self.closeNode.runAction(cc.fadeIn(0.3));    
            })
        ));
        this.bg.opacity = 0;
        this.bg.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.fadeTo(0.5, 177)
        ));
    }

    protected showCloseMoreGame(): void {
        if (!this.show) {
            return;
        }
        this.show = false;
        var self = this;
        this.board.runAction(cc.sequence(
            cc.moveBy(0.5, cc.v2(-this.originalWidth, 0)).easing(cc.easeQuadraticActionOut()),
            cc.callFunc(function () {
                self.node.active = false;
            })
        ));
    }

    protected close(): void {
        this.showCloseMoreGame();
    }
}