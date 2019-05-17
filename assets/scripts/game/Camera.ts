import { WorldEventManager } from "../../game-common/Script/GameCommon/WorldEventManager";
import { EventEnum } from "../common/EventEnum";

const { ccclass, property } = cc._decorator;

@ccclass
export class Camera extends cc.Component {

    @property(cc.Float)
    private shakeRadius: number = 10;

    private zoomCamera: boolean = false;

    private zoomIn: boolean = true;

    private static shakeTime: number = 0;

    private position: cc.Vec2 = null;

    public onEnable(): void {
        this.position = cc.Vec2.ZERO;
        WorldEventManager.addListener(EventEnum.PLAYER_DEAD, this.onPlayerDead, this);
        this.getComponent(cc.Camera).zoomRatio = 1;
    }

    public onDisable(): void {
        WorldEventManager.removeListener(EventEnum.PLAYER_DEAD, this.onPlayerDead, this);
    }

    private onPlayerDead(): void {
        this.zoomCamera = true;
        this.zoomIn = true;
        this.node.position = this.node.getParent().convertToNodeSpaceAR(playerController.player.position);
        this.scheduleOnce(() => {
            this.zoomIn = false;
        }, 0.8);
    }

    public update(dt: number): void {
        if (Camera.shakeTime > 0) {
            Camera.shakeTime -= dt;
        } else {
            this.position = cc.Vec2.ZERO;
        }
    }

    public lateUpdate(): void {
        if (this.zoomCamera) {
            if (this.zoomIn) {
                this.getComponent(cc.Camera).zoomRatio += 0.01;
            } else {
                if (this.getComponent(cc.Camera).zoomRatio > 1) {
                    this.getComponent(cc.Camera).zoomRatio -= 0.01;
                } else {
                    this.getComponent(cc.Camera).zoomRatio = 1;
                    this.node.position = cc.Vec2.ZERO;
                    this.zoomCamera = false;
                }
            }
            return;
        }
        if (Camera.shakeTime > 0) {
            let offset = cc.Vec2.ZERO;
            offset.x = (Math.random() - 0.5) * this.shakeRadius;
            this.position.addSelf(offset);
        }
        this.node.position = this.position;
    }

    public static shake(time: number): void {
        this.shakeTime = time;
    }
}