import { ITouch } from "../../Interface/ITouch";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Move extends cc.Component {
    private iTouch: ITouch = null;
    private curDirec: cc.Vec2 = null;
    private speed: number = 10;

    public onLoad(): void {
    }

    public update(dt): void {
        this.computeMove(dt);
    }

    private computeMove(delTime: number): void {
        this.curDirec = cc.Vec2.UP// this.iTouch.getDirection();
        if (this.curDirec && this.curDirec != cc.Vec2.ZERO) {
            this.node.setPosition(this.node.position.add(this.curDirec.mul(this.speed * delTime)));
        }
    }
}
