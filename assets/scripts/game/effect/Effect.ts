import { GameCommonPool } from "../../../game-common/Script/GameCommon/GameCommonPool";
import { GameComponent } from "../../common/GameComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export class Effect extends GameComponent {

    @property(cc.Animation)
    protected anim: cc.Animation = null;

    protected callBack: () => void = null;

    public bindCallBack(callBack: () => void): void {
        this.callBack = callBack;
    }

    public onEnable(): void {
        let duration: number = this.anim.play().duration;
        let effect: Effect = this;
        this.scheduleOnce(() => {
            if (this.callBack) {
                this.callBack();
                this.callBack = null;
            }
            GameCommonPool.returnInstant(effect.node);
        }, duration);
    }

    public onDisable(): void {
        this.unscheduleAllCallbacks();
    }
}
