import BaseSkill from "../skill/BaseSkill";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Role extends cc.Component {

    public Hp: number = 1;
    public name: string = "";
    public skills: BaseSkill[] = [];
    public damage: number = 1;
    public defendValue: number = 0;
    public roleAnim: cc.Animation = null;
    public deadAnimNames: string[] = [];
    //public weapon:?//

    protected move(): void {

    }

    protected attack(role: Role): void {
        let hurt = this.damage - role.defendValue;
        role.onDamage(hurt);
    }

    protected onDamage(hurt: number): void {
        this.Hp -= hurt;
        if (this.Hp < 0) {
            this.Hp = 0;
        }
        if (this.Hp == 0) {
            this.onDead();
        }
    }

    protected onDead(): void {
        if (this.deadAnimNames.length > 0) {
            let animIndex = -1;
            animIndex = Math.floor(Math.random() * this.deadAnimNames.length);
            animIndex >= 0 && this.roleAnim.play(this.deadAnimNames[animIndex]);
        }
    }
}
