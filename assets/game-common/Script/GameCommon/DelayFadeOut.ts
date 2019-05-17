import { GameCommonPool } from "./GameCommonPool";

const { ccclass, property } = cc._decorator;

@ccclass
export class DelayFadeOut extends cc.Component {

    @property
    protected delay: number = 1;

    protected liveTime: number = 0;

    onEnable() {

        this.node.stopAllActions();

        this.node.opacity = 255;

        this.liveTime = 0;

        this.node.runAction(cc.sequence(
            cc.delayTime(this.delay - 0.5),
            cc.fadeOut(0.5)
        ));
    }

    update(dt: number): void {
        this.liveTime += dt;

        if (this.liveTime > this.delay) {
            GameCommonPool.returnInstant(this.node);
        }
    }
}
