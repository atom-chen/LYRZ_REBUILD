import { PropData } from "./PropData";
import { GameCommonPool } from "../../../game-common/Script/GameCommon/GameCommonPool";
import { GameComponent } from "../../common/GameComponent";
import { Util } from "../../tool/Util";
import { RoleType } from "../role/RoleType";
import { Role } from "../role/Role";
import { Player } from "../role/player/Player";

const { ccclass, property } = cc._decorator;

@ccclass
export class PropItem extends GameComponent {

    @property({
        displayName: "道具背景",
        type: cc.Node
    })
    private bgNode: cc.Node = null;

    @property({
        displayName: "道具影子",
        type: cc.Node
    })
    private shadowNode: cc.Node = null;

    @property({
        displayName: "道具节点",
        type: cc.Node
    })
    private propNode: cc.Node = null;

    @property({
        displayName: "移动速度",
        type: cc.Integer
    })
    private speed: number = 100;

    private mPropData: PropData = null;

    private direction: cc.Vec2 = null;

    private worldPosition: cc.Vec2 = null;

    public get propData(): PropData {
        return this.mPropData;
    }

    private mIndex: number = 0;

    public get index(): number {
        return this.mIndex;
    }

    public initData(index: number, propData: PropData): void {
        this.mIndex = index;
        this.mPropData = propData;
        let deg: number = 0;
        let random: number = Math.random();
        if (random < 0.25) {
            deg = -45;
        } else if (random < 0.5) {
            deg = 45;
        } else if (random < 0.75) {
            deg = 135;

        } else if (random <= 1) {
            deg = -135;
        }
        this.direction = Util._degreesToVector(deg);
        this.worldPosition = Util.getWorldPosition(this.node);
    }

    public onEnable(): void {
        if (this.propNode) {
            this.propNode.position = cc.Vec2.ZERO;
            this.propNode.runAction(cc.repeatForever(cc.sequence(cc.moveTo(1, cc.v2(0, 10)), cc.moveTo(1, cc.Vec2.ZERO))));
        }
        if (this.bgNode) {
            this.bgNode.rotation = 0;
            this.bgNode.runAction(cc.repeatForever(cc.rotateBy(2, 360)));
        }
        if (this.shadowNode) {
            this.shadowNode.scale = 1;
            this.shadowNode.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(1, 0.7), cc.scaleTo(1, 1))));
        }
    }

    public gameUpdate(dt: number): void {
        if (!gameManager.isStart || !gameManager.isPlay) {
            return;
        }
        this.worldPosition.x += this.speed * this.direction.x * dt;
        this.worldPosition.y += this.speed * this.direction.y * dt;
        if (this.worldPosition.x < nodeManager.validRect.xMin + this.node.width || this.worldPosition.x > nodeManager.validRect.xMax - this.node.width) {
            this.direction.x *= -1;
        }
        if (this.worldPosition.y < nodeManager.validRect.yMin + this.node.height || this.worldPosition.y > nodeManager.validRect.yMax - this.node.height) {
            this.direction.y *= -1;
        }
        this.node.position = this.node.getParent().convertToNodeSpaceAR(this.worldPosition);
    }

    private onCollisionEnter(other: cc.Collider, self: cc.Collider): void {
        let player: Player = other.getComponent(Player)
        if (player == null) {
            return;
        }
        player.useProp(this.propData);
        propController.despawnProp(this.index);
    }

    public onDisable(): void {
        if (this.propNode) {
            this.propNode.stopAllActions();
        }
        if (this.bgNode) {
            this.bgNode.stopAllActions();
        }
        if (this.shadowNode) {
            this.shadowNode.stopAllActions();
        }
    }

    public recycle(): void {
        this.mPropData = null;
        GameCommonPool.returnInstant(this.node);
    }
}