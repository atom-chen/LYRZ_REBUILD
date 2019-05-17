import { GameComponent } from "../../common/GameComponent";
import { Util } from "../../tool/Util";
import { GameCommonPool } from "../../../game-common/Script/GameCommon/GameCommonPool";
import { Role } from "../role/Role";

/**
 * Created by 郭荣凯
 * Time: 2019/04/010.
 * 投掷物的基类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export class Projectile extends GameComponent {
    @property(cc.Integer)
    protected moveSpeed: number = 100;

    protected direction: cc.Vec2 = cc.Vec2.ZERO;

    protected isMoving: boolean = false;

    public init(targetPos: cc.Vec2): void {
        let dir = targetPos.sub(Util.getWorldPosition(this.node));
        let deg = Util._directionToRotation(dir);
        let rotation = deg;
        this.node.rotation = rotation;
        this.direction = dir.normalize();
        this.isMoving = true;
    }

    protected hit(): void {
        this.onBrokenFXFinished();
    }

    protected onBrokenFXFinished(): void {
        GameCommonPool.returnInstant(this.node);
    }

    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        let role: Role = other.getComponent(Role);
        if (role) {
            if (role.roleData && role.roleData.roleType === playerController.player.roleType && role.roleData.alive) {
                role.receivedDamage(1);
                this.hit();
            }
        }
    }

    public gameUpdate(dt: number): void {
        if (!this.isMoving) {
            return;
        }
        this.node.x += this.moveSpeed * this.direction.x * dt;
        this.node.y += this.moveSpeed * this.direction.y * dt;
        if (Math.abs(this.node.x) > nodeManager.validRect.width / 2 ||
            Math.abs(this.node.y) > nodeManager.validRect.height / 2) {
            this.onBrokenFXFinished();
        }
    }

    public recycle(): void {
        this.unscheduleAllCallbacks();
        GameCommonPool.returnInstant(this.node);
    }
}
