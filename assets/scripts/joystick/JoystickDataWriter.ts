import { JoystickBG } from "./JoystickBG";
import { RoleStatus } from "../game/role/RoleStatus";
import { AttackPattern } from "../game/role/player/AttackPattern";
import { Util } from "../tool/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export class JoystickDataWriter extends cc.Component {

    @property(cc.Node)
    private clickRange: cc.Node = null;

    private lastTouchPosition: cc.Vec2 = null;

    private touchId: number = -1;

    private catchTouchPosition: Array<cc.Vec2> = new Array();

    public onEnable(): void {
        var self = this;
        self.clickRange.on(cc.Node.EventType.TOUCH_START, this.touchStartEvent, self);
        self.clickRange.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, self);
        self.clickRange.on(cc.Node.EventType.TOUCH_END, this.touchEndEvent, self);
        self.clickRange.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, self);
    }

    public onDisable(): void {
        var self = this;
        self.clickRange.off(cc.Node.EventType.TOUCH_START, this.touchStartEvent, self);
        self.clickRange.off(cc.Node.EventType.TOUCH_MOVE, this.touchMoveEvent, self);
        self.clickRange.off(cc.Node.EventType.TOUCH_END, this.touchEndEvent, self);
        self.clickRange.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEndEvent, self);
    }

    private touchStartEvent(event: cc.Event.EventTouch): void {
        if (playerController.isOnTouch) {
            return;
        }
        this.touchId = event.getID();
        let location: cc.Vec2 = event.getLocation();
        //取整避免抖动
        location.x = Math.floor(location.x);
        location.y = Math.floor(location.y);
        playerController.isOnTouch = true;
        this.lastTouchPosition = location.clone();
        if (!gameManager.isStart || !gameManager.isPlay) {
            return;
        }
    }

    private touchMoveEvent(event: cc.Event.EventTouch): void {
        if (this.touchId !== event.getID() || !playerController.player) {
            return;
        }
        //触摸时不断变更的位置
        let newPos: cc.Vec2 = event.getLocation();

        //取整避免抖动
        newPos.x = Math.floor(newPos.x);
        newPos.y = Math.floor(newPos.y);

        if (playerController.playerAttackPattern() === AttackPattern.FLICKER) {
            this.lastTouchPosition = newPos.clone();
            let direction: cc.Vec2 = newPos.sub(playerController.player.position);
            if (direction.magSqr() > 1) {
                playerController.player.moveDir = direction.normalize();
            }
            return;
        }
        if (playerController.player.roleStatus === RoleStatus.DAMAGE || playerController.player.roleStatus === RoleStatus.RELEASEING
            || playerController.player.roleStatus === RoleStatus.START) {
            this.lastTouchPosition = newPos.clone();
            return;
        }
        let coefficient: number = 1 + playerController.player.speedOffsetPercent / 100;
        if (playerController.playerAttackPattern() === AttackPattern.KILL_ARRAY) {
            coefficient = 1;
        }
        let offset: cc.Vec2 = newPos.sub(this.lastTouchPosition);
        this.addCatchTouchPosition(this.lastTouchPosition.clone());
        let dirction: cc.Vec2 = newPos.sub(this.getCatchTouchPosition());
        playerController.player.moveDir = dirction.normalize();
        offset = Util.pMult(offset, coefficient);
        let newPosition = playerController.player.position.add(offset);
        playerController.player.position = newPosition;
        this.lastTouchPosition = newPos.clone();
    }

    private touchEndEvent(event: cc.Event.EventTouch): void {
        if (this.touchId !== event.getID() && playerController.isOnTouch) {
            return;
        }
        this.touchId = -1;
        playerController.isOnTouch = false;
        if (!playerController.player) {
            return;
        }
        playerController.player.moveDir = null;
        this.catchTouchPosition = new Array();
    }

    private addCatchTouchPosition(position: cc.Vec2): void {
        if (this.catchTouchPosition.length >= 10) {
            this.catchTouchPosition.splice(0, 1);
        }
        this.catchTouchPosition.push(position);
    }

    private getCatchTouchPosition(): cc.Vec2 {
        if (this.catchTouchPosition.length === 0) {
            return this.lastTouchPosition;
        }
        return this.catchTouchPosition[0];
    }
}