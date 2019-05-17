const { ccclass, property } = cc._decorator;

@ccclass
export class CommonTip extends cc.Component {

    @property({
        type: cc.RichText
    })
    protected tipText: cc.RichText = null;

    /**
     * 显示提示框
     * @param tipInfo 需要显示的文字信息 
     * @param color 需要显示的文字的颜色，默认使用rgb535353
     */
    show(tipInfo: string, color: cc.Color = null): void {
        if (tipInfo == null) {
            return;
        }
        var hex = color == null ? "535353" : color.toHEX("#rrggbb"); 
        this.tipText.string = "<color=#" + hex + "><b>" + tipInfo + "</b></c>";
        this.node.height = this.tipText.node.height + 30;
    }
}
