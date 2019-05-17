import { LevelItem } from "./LevelItem";
import { Util } from "../../../tool/Util";

const { ccclass, property } = cc._decorator;
/**
 * Created by 郭荣凯
 * Time: 2019/04/25.
 * 开始界面关卡显示容器
 */
@ccclass
export class LevelContainer extends cc.Component {

    @property({
        displayName: "关卡显示物体列表",
        type: [LevelItem]
    })
    private levelItems: Array<LevelItem> = new Array();

    public onEnable(): void {
        for (let index = 0; index < this.levelItems.length; index++) {
            const item = this.levelItems[index];
            let level: number = levelManager.currentLevel + index - 1;
            if (level > levelManager.maxLevel || level <= 0) {
                item.node.active = false;
                continue;
            }
            item.node.active = true;
            if (level < 10) {
                item.bindData(level + "");
            } else if (level === 10) {
                item.bindData("0");
            } else if (level < 20) {
                item.bindData("0" + (level - 10));
            } else {
                item.bindData(Util.insertString(level.toString(), 0, "0"));
            }
        }
    }
}
