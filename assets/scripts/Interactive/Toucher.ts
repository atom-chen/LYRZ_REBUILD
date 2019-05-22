
const { ccclass, property } = cc._decorator;

@ccclass
export default class Toucher extends cc.Component implements ITouch {
    getDirection(): cc.Vec2 {
        return this.direc;
    }

    private direc: cc.Vec2 = null;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    private onTouchMove(event): void {
        let delta = event.touch.getDelta();
        let direction = cc.v2(delta.x, delta.y);
        if (direction.mag() < 0.01) {
            this.direc = cc.Vec2.ZERO;
        }
        else {
            this.direc = cc.v2(delta.x, delta.y).normalize();
        }
    }

    private onTouchEnd(event): void {
        this.direc = cc.Vec2.ZERO;
    }
}
