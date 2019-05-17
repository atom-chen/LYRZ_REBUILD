/**
 * Created by 郭荣凯
 * Time: 2019/04/017.
 * 连击动画
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class ComboAnimation extends cc.Component {

    @property({
        displayName: "连击数文本",
        type: cc.Label
    })
    private comboLabel: cc.Label = null;

    @property({
        displayName: "动画",
        type: cc.Animation
    })
    private comboAnim: cc.Animation = null;

    public runShowComboAnimation(comboNumber: number): void {
        this.comboLabel.string = comboNumber + "";
        this.comboAnim.play("showCombo");
    }

    public runChangeCombonimation(comboNumber: number): void {
        this.comboLabel.string = comboNumber + "";
        this.comboAnim.playAdditive("changeCombo");
    }
}
