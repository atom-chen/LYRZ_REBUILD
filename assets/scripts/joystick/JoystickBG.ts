import { Util } from "../tool/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export class JoystickBG extends cc.Component {

    @property(cc.Node)
    private dot: cc.Node = null;

    @property(cc.Float)
    public stickX: number = 0;

    @property(cc.Float)
    public stickY: number = 0;

    private _lastX: number;
    private _lastY: number;

    public touchMoveEvent(event: any): void {
        // cc.FLog.warn("feifeiTouch:" + "_touchMoveEvent");
        let location = event.getLocation();
        location.x = Math.floor(location.x);
        location.y = Math.floor(location.y);
        if (location.x == this._lastX && location.y == this._lastY) {
            return;
        }
        this._lastX = location.x;
        this._lastY = location.y;

        this.dot.opacity = 255;

        let touchPos = this.node.convertToNodeSpaceAR(event.getLocation());
        let distance = Util._getDistance(touchPos, cc.v2(0, 0));
        let radius = this.node.width / 2;
        let pos = cc.Vec2.ZERO;
        // 由于摇杆的postion是以父节点为锚点，所以定位要加上ring和dot当前的位置(stickX,stickY)
        let posX = pos.x + touchPos.x;
        let posY = pos.y + touchPos.y;

        if (radius > distance) {
            this.dot.setPosition(cc.v2(posX, posY));
        } else {
            //控杆永远保持在圈内，并在圈内跟随触摸更新角度

            let angle = Util._angle(cc.v2(posX, posY), pos);

            let radian = Util._getRadian(angle);

            let x = pos.x + Math.cos(radian) * radius;
            let y = pos.y + Math.sin(radian) * radius;
            this.dot.setPosition(cc.v2(x, y));
        }

        this.stickX = posX - pos.x;

        this.stickY = posY - pos.y;
    }

    public touchEndEvent(): void {

        //   cc.FLog.warn("feifeiTouch:" + "_touchEndEvent");

        this.dot.setPosition(cc.Vec2.ZERO);

        this.dot.opacity = 100;

        this.stickX = 0;

        this.stickY = 0;
    }
}
