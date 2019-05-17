import { DayliLoginItemData } from "./DayliLogin";

const {ccclass, property} = cc._decorator;

@ccclass
export class DayliLoginItem extends cc.Component {

    @property(cc.Node)
    protected todayReward: cc.Node = null;
    
    @property(cc.Node)
    protected recievedReward: cc.Node = null;

    @property(cc.Sprite)
    protected rewardSprite: cc.Sprite = null;
    
    @property(cc.Label)
    protected rewardName: cc.Label = null;
    
    @property(cc.Button)
    protected itemButton: cc.Button = null;

    protected itemData: DayliLoginItemData = null;

    onEnable(): void {
        this.itemButton.interactable = false;
    }

    public bindData(itemData: DayliLoginItemData, recieved: boolean, canRecieve: boolean): void {
        if (itemData == null) {
            return;
        }
        this.itemData = itemData;
        this.rewardSprite.spriteFrame = itemData.itemSpriteFrame;
        this.rewardName.string = itemData.itemName;
        this.rewardSprite.node.scale = itemData.itemScale;
        this.refresh(recieved, canRecieve);
    }

    public refresh(recieved: boolean, canRecieve: boolean): void {
        if (this.itemData == null) {
            return;
        }

        if (recieved) {
            this.recievedReward.active = true;
            this.todayReward.active = false;
            this.itemButton.interactable = false;
        } else if (canRecieve) {
            this.recievedReward.active = false;
            this.todayReward.active = true;
            this.itemButton.interactable = true;
        } else {
            this.recievedReward.active = false;
            this.todayReward.active = false;
            this.itemButton.interactable = false;
        }
    }
}
