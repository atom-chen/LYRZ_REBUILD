import { DialItemData } from "./DialManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class DialItem extends cc.Component {

    @property(cc.Sprite)
    protected dialItemIcon: cc.Sprite = null;

    @property(cc.Label)
    protected dialItemCount: cc.Label = null;

    @property(cc.Label)
    protected dialItemName: cc.Label = null;

    protected _data: DialItemData = null;

    public bindData(data: DialItemData): void {

        if (data == null) {
            return;
        }

        this._data = data;
        this.dialItemIcon.spriteFrame = data.itemSpriteFrame;
        this.dialItemIcon.node.scale = data.itemScale;
        if (this.dialItemCount) {
            this.dialItemCount.string = data.itemCount + "";
        }
        if (this.dialItemName) {
            this.dialItemName.string = data.itemName;
        }
    }

    public get data(): DialItemData {
        return this._data;
    }
}
