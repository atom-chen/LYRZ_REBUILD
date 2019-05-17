import { ShareManager, ShareControlType } from "../ShareCommon/ShareManager";
import { DayliLoginItem } from "./DayliLoginItem";
import { UserData } from "../GameCommon/UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export class DayliLogin extends cc.Component {

    @property(cc.Node)
    protected boradNode: cc.Node = null;

    @property(cc.Node)
    protected closeNode: cc.Node = null;

    @property(cc.Node)
    protected doubbleRecieveBtnNode: cc.Node = null;

    @property(cc.Node)
    protected cancelRecieveBtnNode: cc.Node = null;

    @property([DayliLoginItem])
    protected items: DayliLoginItem[] = new Array();

    protected itemDatas: Array<DayliLoginItemData> = null;
    protected recievedCount: number = 0;
    protected canRecievedCount: number = 0;

    protected clickRecieveAction: (itemData: DayliLoginItemData, isDoubble: boolean, successCall: () => void) => void = null;

    onEnable(): void {
        this.boradNode.stopAllActions();
        this.closeNode.stopAllActions();
        this.doubbleRecieveBtnNode.stopAllActions();
        this.cancelRecieveBtnNode.stopAllActions();

        this.cancelRecieveBtnNode.opacity = 0;
        this.closeNode.opacity = 0;
        this.doubbleRecieveBtnNode.opacity = 0;

        this.boradNode.opacity = 0;
        this.boradNode.scale = 0;

        this.boradNode.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(0.4, 1), cc.fadeIn(0.4)),
            cc.callFunc(() => {
                this.doubbleRecieveBtnNode.runAction(cc.fadeIn(0.3));
            }),
            cc.delayTime(0.3),
            cc.callFunc(() => {
                this.closeNode.runAction(cc.fadeIn(0.3));
                this.cancelRecieveBtnNode.runAction(cc.fadeIn(0.3));
            })
        ));

        if (ShareManager.getShareControlType() == ShareControlType.ShareAndAdClose) {
            this.doubbleRecieveBtnNode.active = false;
        }
    }

    public bindData(recievedCount: number, canRecievedCount: number, itemDatas: Array<DayliLoginItemData>, clickRecieveAction: (itemData: DayliLoginItemData, isDoubble: boolean, successCall: () => void) => void): void {
        this.recievedCount = recievedCount;
        this.canRecievedCount = canRecievedCount;
        this.itemDatas = itemDatas;
        this.clickRecieveAction = clickRecieveAction;
        this.refresh();
    }

    protected refresh(): void {
        if (this.canRecievedCount <= this.recievedCount) {
            this.doubbleRecieveBtnNode.active = false;
            this.cancelRecieveBtnNode.active = false;
        }
        if (this.itemDatas == null) {
            return;
        }
        for (let i = 0; i < 7; i++) {
            let item = this.items[i];
            if (item != null) {
                item.bindData(this.itemDatas[i], this.recievedCount > i, this.canRecievedCount > i);
            }
        }
    }

    protected clickClose(): void {
        this.node.active = false;
    }

    protected clickRecieve(): void {
        if (this.canRecievedCount <= this.recievedCount) {
            return;
        }
        if (this.clickRecieveAction != null) {
            let successCall = () => {
                this.recievedCount++;
                this.refresh();
                UserData.data.loginRewardRecievedCount++;
            };
            this.clickRecieveAction(this.itemDatas[this.recievedCount], false, successCall);
        }
    }

    protected clcikNoThanks(): void {
        this.node.active = false;
    }

    protected clickDoubbleRecieve(): void {
        if (this.canRecievedCount <= this.recievedCount) {
            return;
        }
        if (this.clickRecieveAction != null) {
            let successCall = () => {
                this.recievedCount++;
                this.refresh();
                UserData.data.loginRewardRecievedCount++;
            };
            this.clickRecieveAction(this.itemDatas[this.recievedCount], true, successCall);
        }
    }
}

export class DayliLoginItemData {

    public itemType: number | string;
    public itemName: string = null;
    public itemCount: number = 0;
    public itemSpriteFrame: cc.SpriteFrame = null;
    public itemScale: number = 1;

    /**
     * 生成每日签到奖励元素数据
     * @param itemType 奖励的道具类型
     * @param itemName 奖励的名称
     * @param itemSpriteFrame 奖励的道具图
     * @param itemCount 奖励的道具数量
     * @param itemScale 奖励图片的缩放，默认为1原始大小
     */
    constructor(itemType: number | string, itemName: string, itemSpriteFrame: cc.SpriteFrame, itemCount: number, itemScale: number = 1) {
        this.itemType = itemType;
        this.itemName = itemName;
        this.itemSpriteFrame = itemSpriteFrame;
        this.itemCount = itemCount;
        this.itemScale = itemScale;
    }
}
