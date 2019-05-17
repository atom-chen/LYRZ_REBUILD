import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { CommonTip } from "./CommonTip";
import { CommonToast } from "./CommonToast";

const { ccclass, property } = cc._decorator;

@ccclass
export class TipManager extends cc.Component {

    protected static instance: TipManager = null;

    public static tipColor: cc.Color = null;

    public static toastColor: cc.Color = null;

    @property({
        displayName: "显示提示框的节点",
        type: cc.Node
    })
    protected tipNode: cc.Node = null;

    @property({
        displayName: "显示对话框的节点",
        type: cc.Node
    })
    protected toastNode: cc.Node = null;

    @property({
        displayName: "提示框的预设",
        type: cc.Prefab
    })
    protected tipPrefab: cc.Prefab = null;

    @property({
        displayName: "对话框框的预设",
        type: cc.Prefab
    })
    protected toastPrefab: cc.Prefab = null;

    protected static tipArray: cc.Node[] = new Array();

    public onLoad(): void {
        TipManager.instance = this;
    }

    /**
     * 显示对话框
     * @param text 需要显示的文字信息 
     */
    public static showToast(text: string): void {
        if (text == null) {
            return;
        }
        var tipManager = TipManager.instance;
        if (tipManager == null || tipManager.toastNode == null) {
            return;
        }
        var toast = GameCommonPool.requestInstant(tipManager.toastPrefab);
        if (toast == null) {
            return;
        }
        toast.setParent(tipManager.toastNode);
        var commonToast = toast.getComponent(CommonToast);
        if (commonToast == null) {
            return;
        }
        commonToast.showText(text, this.toastColor);
    }

    /**
     * 显示提示框
     * @param tipInfo 需要显示的文字信息 
     */
    public static showTip(tipInfo: string): void {
        if (tipInfo == null) {
            return;
        }
        var tipManager = TipManager.instance;
        if (tipManager == null || tipManager.tipNode == null) {
            return;
        }
        var tip = GameCommonPool.requestInstant(tipManager.tipPrefab);
        if (tip == null) {
            return;
        }
        tip.setParent(tipManager.tipNode);
        tip.y = 0;
        var commonTip = tip.getComponent(CommonTip);
        if (commonTip == null) {
            return;
        }
        commonTip.show(tipInfo, this.tipColor);

        if (this.tipArray.length >= 3) {
            var firstTip = this.tipArray.shift();
            if (firstTip && firstTip.active) {
                GameCommonPool.returnInstant(firstTip);
            }
        }

        var yOffSet = 0;

        for (var index = this.tipArray.length - 1; index >= 0; index--) {
            var currentTip = this.tipArray[index];
            // console.log("y:" + currentTip.y);
            if (yOffSet == 0) {
                yOffSet = tip.height * 0.5 + currentTip.height * 0.5 + 10;
            }
            currentTip.y += yOffSet;
            // console.log("y:" + currentTip.y);
        }

        this.tipArray.push(tip);
    }

    update(dt: number): void {
        while (TipManager.tipArray[0] != null && !TipManager.tipArray[0].active) {
            TipManager.tipArray.shift();
        }
    }
}
