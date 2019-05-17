import { Projectile } from "./Projectile";
import { Role } from "../role/Role";
import { RoleStatus } from "../role/RoleStatus";
import { HitTrigger } from "../role/HitTrigger";
import { RoleType } from "../role/RoleType";

const { ccclass, property } = cc._decorator;

@ccclass
export class Arrow extends Projectile {
    @property(cc.Node)
    private arrowNode: cc.Node = null;

    @property(cc.Node)
    private brokenArrowNode: cc.Node = null;

    private isBroke: boolean = false;

    public init(targetPos: cc.Vec2): void {
        super.init(targetPos);
        this.brokenArrowNode.active = false;
        this.arrowNode.active = true;
        this.isBroke = false;
    }

    private broke(): void {
        this.isMoving = false;
        this.arrowNode.active = false;
        this.brokenArrowNode.active = true;
        this.isBroke = true;
        this.scheduleOnce(this.hit, 1);
    }

    protected onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        if (this.isBroke) {
            return;
        }
        let role: Role = other.getComponent(Role);
        if (role) {
            if (role.roleData && role.roleData.roleType === playerController.player.roleType && role.roleData.alive) {
                if (role.roleData.roleStatus === RoleStatus.ATTACKING) {
                    this.broke();
                } else {
                    role.receivedDamage(1);
                    this.hit();
                }
            }
        } else {
            let hit: HitTrigger = other.getComponent(HitTrigger);
            if (hit && hit.roleType === RoleType.Player) {
                this.broke();
            }
        }
    }
}
