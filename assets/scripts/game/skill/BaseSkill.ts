import SkillEffect from "./SkillEffect";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseSkill {

    public id: number = -1;
    public name: string = "";
    public desc: string = "";
    public skillEffect: SkillEffect = null;
    public CD: number = 0;
}
