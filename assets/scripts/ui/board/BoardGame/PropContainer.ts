import { PropSkillItem } from "./PropSkillItem";
import { PropData } from "../../../game/prop/PropData";

/**
 * Created by 郭荣凯
 * Time: 2019/04/03.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class PropContainer extends cc.Component {

    private propSkills: Array<PropSkillItem> = new Array();

    public onLoad(): void {
        this.propSkills = this.getComponentsInChildren(PropSkillItem);
    }

    public onPickProp(propData: PropData): void {
        if (propData == null) {
            return;
        }
        for (const propSkill of this.propSkills) {
            if (propSkill.propData == null || propSkill.propData.id === propData.id) {
                propSkill.bindData(propData);
                break;
            }
        }
    }

    /**
     * 清除道具
     */
    public clearPropContainer(): void {
        for (const propSkill of this.propSkills) {
            propSkill.clear();
        }
    }
}
