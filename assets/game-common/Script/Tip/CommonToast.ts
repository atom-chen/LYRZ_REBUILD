import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { CommonTip } from "./CommonTip";

const { ccclass, property } = cc._decorator;

@ccclass
export class CommonToast extends cc.Component {

    @property(CommonTip)
    protected text: CommonTip = null;

    /**
     * 显示对话框
     * @param text 需要显示的文字信息 
     * @param color 需要显示的文字的颜色，默认使用rgb535353
     */
    public showText(text: string, color: cc.Color = null): void {
        if (this.text == null) {
            return;
        }
        this.text.show(text, color);
    }

    public clickClose(): void {
        GameCommonPool.returnInstant(this.node);
    }
}
