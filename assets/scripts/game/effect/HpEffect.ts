import { Effect } from "./Effect";

const { ccclass, property } = cc._decorator;

@ccclass
export class HpEffect extends Effect {

    public onEnable(): void {
        let duration: number = this.anim.play().duration;
        this.scheduleOnce(() => {
            if (this.callBack) {
                this.callBack();
                this.callBack = null;
            }
            this.node.active = false;;
        }, duration);
    }
}
