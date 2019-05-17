const { ccclass, property } = cc._decorator;
export enum SkillType {
    Attack,
    DeBuff,
    Buff,
    Recover,
}

@ccclass
export default class SkillEffect {
    public skillType: SkillType = null;

    public executeEffect(): void {

    }
}
