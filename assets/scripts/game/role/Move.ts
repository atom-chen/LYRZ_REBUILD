import Toucher from "../../Interactive/Toucher";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Move extends cc.Component {
    @property(Toucher)
    public iTouch: ITouch = null;

    private curDirec: cc.Vec2 = null;
    private speed: number = 100;

    public onLoad(): void {
    }

    public update(dt): void {
        this.computeMove(dt);
    }

    private computeMove(delTime: number): void {
        this.curDirec = this.iTouch.getDirection();
        if (this.curDirec && this.curDirec != cc.Vec2.ZERO) {
            this.node.setPosition(this.node.position.add(this.curDirec.mul(this.speed * delTime)));
        }
    }
}
