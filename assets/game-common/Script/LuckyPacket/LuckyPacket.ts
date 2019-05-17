import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { UserData } from "../GameCommon/UserData";
import { ShareManager, ShareControlType } from "../ShareCommon/ShareManager";
import { AdManager } from "../AdManager/AdManager";
import { TipManager } from "../Tip/TipManager";
import { GameConfig } from "../GameCommon/GameCommon";

const { ccclass, property } = cc._decorator;

@ccclass
export class LuckyPacket extends cc.Component {

    @property(cc.Prefab)
    private exchangePrefab: cc.Prefab = null;

    @property(cc.Label)
    private luckyCardCountLabel: cc.Label = null;

    @property(cc.Node)
    private openNode: cc.Node = null;

    @property(cc.Node)
    private closeBtn: cc.Node = null;

    @property(cc.Node)
    private confirmBtn: cc.Node = null;

    @property(cc.Node)
    private confirmNode: cc.Node = null;

    public onEnable(): void {

        if (!ShareManager.getLuckyPacketControl()) {
            this.clickClose();
            return;
        }

        this.openNode.active = true;
        this.confirmNode.active = false;
        this.showOpenNodeAction();
    }

    private showOpenNodeAction(): void {
        this.openNode.stopAllActions();
        this.openNode.opacity = 0;
        this.openNode.scale = 0;
        this.closeBtn.stopAllActions();
        this.closeBtn.active = false;
        this.closeBtn.opacity = 0;
        this.confirmBtn.stopAllActions();
        this.confirmBtn.active = false;
        this.confirmBtn.opacity = 0;
        this.openNode.runAction(cc.sequence(
            cc.spawn(
                cc.fadeIn(0.4),
                cc.scaleTo(0.4, 1)
            ),
            cc.callFunc(() => {
                this.confirmBtn.active = true;
                this.confirmBtn.runAction(cc.fadeIn(0.3));
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.closeBtn.active = true;
                this.closeBtn.runAction(cc.fadeIn(0.3));
            })
        ));
    }

    private showConfirmNodeAction(): void {

    }

    private clickOpen(): void {

        let succFunc = () => {
            let luckyCardCount = UserData.getNextLuckyCardCount();
            UserData.recieveLuckyPacket(luckyCardCount);
            this.luckyCardCountLabel.string = "X" + luckyCardCount;
            this.openNode.active = false;
            this.confirmNode.active = true;
        }

        if (ShareManager.getShareControlType() == ShareControlType.ShareAndAdClose) {
            succFunc();
            return;
        }

        if ((GameConfig.diffUserForShare && UserData.data.newUserForShare) ||
            ShareManager.getShareControlType() == ShareControlType.ShareCloseAndAdOpen || ShareManager.getShareControlType() == ShareControlType.VolationShareCloseAndAdOpen) {
            AdManager.showVideoAd(
                () => {
                    succFunc();
                },
                () => {
                    TipManager.showTip("看完视频才可以领取奖励哦~");
                })
            return;
        }

        if (!ShareManager.getAbonormalShareControl()) {
            window.gameCommon.getSDK.share("打开福袋", null, null, (res: any, success: boolean) => {
                if (success) {
                    succFunc();
                }
            }, true);
            return;
        }

        let shareFunc = () => {
            window.gameCommon.getSDK.levelShare("打开福袋", (success: boolean, cancel: boolean) => {
                if (success) {
                    succFunc();
                } else {
                    let content = cancel ? "分享成功才可以打开福袋哦~" : "分享到不同群才可以打开福袋哦~";
                    window.gameCommon.getSDK.showWxModal("分享失败", content, () => {
                        shareFunc();
                    }, null);
                }
            });
        }
        shareFunc();
    }

    private gotoExchange(): void {
        let exchangeNode = GameCommonPool.requestInstant(this.exchangePrefab);
        exchangeNode.setParent(this.node.getParent());
        GameCommonPool.returnInstant(this.node);
    }

    private clickClose(): void {
        GameCommonPool.returnInstant(this.node);
    }
}
