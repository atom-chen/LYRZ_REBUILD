import { DialItemData } from "./DialManager";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { DialItem } from "./DialItem";
import { UserData } from "../GameCommon/UserData";
import { ShareManager, ShareControlType } from "../ShareCommon/ShareManager";
import { TipManager } from "../Tip/TipManager";
import { AdManager } from "../AdManager/AdManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class Dial extends cc.Component {

    @property(cc.Node)
    protected dialNode: cc.Node = null;

    @property(cc.Node)
    protected freeBtn: cc.Node = null;

    @property(cc.Label)
    protected freeLeftCount: cc.Label = null;

    @property(cc.Node)
    protected shareBtn: cc.Node = null;

    @property(cc.Label)
    protected shareLeftCount: cc.Label = null;

    @property(cc.Node)
    protected videoBtn: cc.Node = null;

    @property(cc.Label)
    protected videoLeftCount: cc.Label = null;

    @property([DialItem])
    protected dialItems: DialItem[] = new Array();

    @property(cc.Node)
    protected dialTittle: cc.Node = null;

    @property(cc.Node)
    protected dialBoard: cc.Node = null;

    @property(cc.Node)
    protected dialClose: cc.Node = null;

    protected rewardAction: (itemType: number | string, itemCount: number) => void = null;

    protected animationRun: boolean = false;

    protected currentIndex: number = 0;

    protected leftTimes: number = 0;

    protected randomAction: () => number = null;

    onLoad(): void {

    }

    onEnable(): void {

        this.resetLeftTimes();

        this.dialTittle.stopAllActions();
        this.dialBoard.stopAllActions();
        this.dialClose.stopAllActions();
        this.freeBtn.stopAllActions();
        this.shareBtn.stopAllActions();
        this.videoBtn.stopAllActions();

        this.dialTittle.opacity = 0;
        this.dialClose.opacity = 0;
        this.freeBtn.opacity = 0;
        this.shareBtn.opacity = 0;
        this.videoBtn.opacity = 0;

        this.dialBoard.opacity = 0;
        this.dialBoard.scale = 0;

        this.dialBoard.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.4, 1), cc.fadeIn(0.4)),
            cc.callFunc(() => {
                this.dialTittle.runAction(cc.fadeIn(0.3));
            }),
            cc.delayTime(0.3),
            cc.callFunc(() => {
                this.dialClose.runAction(cc.fadeIn(0.3));
                this.freeBtn.runAction(cc.fadeIn(0.3));
                this.shareBtn.runAction(cc.fadeIn(0.3));
                this.videoBtn.runAction(cc.fadeIn(0.3));
            })
        ));
    }

    protected resetLeftTimes(): void {
        this.freeLeftCount.string = UserData.data.freeDialCard + " / " + UserData.maxFreeDialCard;
        this.shareLeftCount.string = UserData.data.shareDialCard + " / " + UserData.maxShareDialCard;
        this.videoLeftCount.string = UserData.data.videoDialCard + " / " + UserData.maxVideoDialCard;

        if (ShareManager.getShareControlType() == ShareControlType.ShareAndAdClose) {
            this.freeBtn.active = true;
            this.shareBtn.active = false;
            this.videoBtn.active = false;
            return;
        }

        this.freeBtn.active = UserData.data.freeDialCard > 0;

        if (UserData.data.freeDialCard > 0) {
            this.shareBtn.active = false;
            this.videoBtn.active = false;
        } else {
            this.shareBtn.active = ShareManager.getShareControlType() != ShareControlType.ShareCloseAndAdOpen;
            this.videoBtn.active = true;
        }
    }

    public bindData(dialItemDatas: Array<DialItemData>, rewardAction: (itemType: number | string, itemCount: number) => void, randomAction: () => number = null): void {

        this.rewardAction = rewardAction;
        this.randomAction = randomAction;

        if (dialItemDatas == null) {
            return;
        }

        for (var i = 0; i < this.dialItems.length; i++) {
            this.dialItems[i].bindData(dialItemDatas[i]);
        }
    }

    protected clickClose(): void {

        if (this.animationRun) {
            return;
        }

        GameCommonPool.returnInstant(this.node);
    }

    protected clcikFree(): void {
        if (this.animationRun) {
            return;
        }
        if (UserData.data.freeDialCard <= 0) {
            TipManager.showTip("抽奖次数不足，请明天再来~");
            return;
        }
        UserData.data.freeDialCard--;
        this.gainReward();
        this.shareBtn.runAction(cc.fadeIn(0.3));
        this.videoBtn.runAction(cc.fadeIn(0.3));
    }

    protected clcikShare(): void {
        if (this.animationRun) {
            return;
        }
        if (UserData.data.shareDialCard <= 0) {
            TipManager.showTip("抽奖次数不足，请明天再来~");
            return;
        }
        window.gameCommon.getSDK.share("转盘抽奖", null, null, (res: any, success: boolean) => {
            if (success) {
                UserData.data.shareDialCard--;
                this.gainReward();
            }
        }, true);
    }

    protected clcikVideo(): void {
        if (this.animationRun) {
            return;
        }
        if (UserData.data.videoDialCard <= 0) {
            TipManager.showTip("抽奖次数不足，请明天再来~");
            return;
        }
        AdManager.showVideoAd(() => {
            UserData.data.videoDialCard--;
            this.gainReward();
        }, () => {
            TipManager.showTip("看完广告，才可以抽奖哦~");
        });
    }

    protected gainReward(): void {

        if (this.animationRun) {
            return;
        }

        this.resetLeftTimes();

        this.animationRun = true;

        let totalCount = this.dialItems.length;

        let randomIndex = 0;

        if (this.randomAction != null) {
            let fixIndex = this.randomAction();
            if (fixIndex == null || fixIndex < 0 || fixIndex >= totalCount) {
                fixIndex = Math.floor(Math.random() * totalCount);
            }
            randomIndex = fixIndex >= this.currentIndex ? (fixIndex - this.currentIndex) : (fixIndex + totalCount - this.currentIndex);

            this.currentIndex = fixIndex;
        } else {
            randomIndex = Math.floor(Math.random() * totalCount);
            this.currentIndex = (randomIndex + this.currentIndex) % totalCount;
        }

        this.dialNode.runAction(cc.sequence(
            cc.rotateBy(1.5, 360 * 4),
            cc.rotateBy(2, 360 - (randomIndex * 360 / totalCount)).easing(cc.easeBackOut()),
            cc.callFunc(() => {
                this.animationRun = false;
                if (this.rewardAction == null) {
                    return;
                }
                var dialItem = this.dialItems[this.currentIndex];
                if (dialItem == null || dialItem.data == null) {
                    return;
                }
                this.rewardAction(dialItem.data.itemType, dialItem.data.itemCount);
            })
        ));
    }
}
