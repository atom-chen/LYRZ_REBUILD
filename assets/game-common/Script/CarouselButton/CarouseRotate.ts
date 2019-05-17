const { ccclass, property } = cc._decorator;

@ccclass
export class CarouseRotate extends cc.Component {

    @property(cc.Node)
    protected target: cc.Node = null;

    @property(cc.Float)
    protected leftAngle: number = -35;

    @property(cc.Float)
    protected rightAngle: number = 35;

    @property(cc.Float)
    protected duration: number = 0.5;

    @property(cc.Float)
    protected delayTime: number = 1;

    @property(cc.Boolean)
    protected forever: boolean = true;

    protected _action: cc.Action = null;

    public onEnable(): void {
        this.target.stopAllActions();
        this.show();
    }

    public show(): void {
        if (this.target == null) {
            return;
        }
        if (this.forever) {
            this._action = this.target.runAction(cc.repeatForever(cc.sequence(
                cc.rotateTo(this.duration / 2, this.leftAngle), 
                cc.rotateTo(this.duration / 2, this.rightAngle),
                cc.rotateTo(this.duration / 2, this.leftAngle), 
                cc.rotateTo(this.duration / 2, this.rightAngle), 
                cc.rotateTo(this.duration / 2, 0),
                cc.delayTime(this.delayTime)
                )));
        } else {
            this._action = this.target.runAction(cc.sequence(cc.rotateTo(this.duration / 2, this.leftAngle), cc.rotateTo(this.duration / 2, this.rightAngle),
                cc.rotateTo(this.duration / 2, this.leftAngle), cc.rotateTo(this.duration / 2, this.rightAngle), cc.rotateTo(this.duration / 2, this.leftAngle),
                cc.delayTime(this.delayTime)));
        }
    }
    public hide(): void {
        if (this._action != null) {
            this.node.rotation = this.leftAngle;
            this.target.stopAction(this._action);
        }
    }
}
