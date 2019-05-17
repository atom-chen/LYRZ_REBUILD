/**
 * Created by 郭荣凯
 * Time: 2019/04/25.
 * 关卡数物体
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class LevelItem extends cc.Component {

    @property({
        displayName: "关卡文本",
        type: cc.Label
    })
    private levelLabel: cc.Label = null;


    public bindData(text: string): void {
        this.levelLabel.string = text;
    }
}
