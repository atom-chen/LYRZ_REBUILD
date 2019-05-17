import BaseSkill from "../skill/BaseSkill";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Role extends cc.Component {

    public Hp: number = 1;
    public name: string = "";
    public skills: BaseSkill[] = [];
    //public weapon:?//

    public attack(damage: number): void {

    }

    public onDamage(hurt: number): void {

    }

    public onDead(): void {

    }
}
