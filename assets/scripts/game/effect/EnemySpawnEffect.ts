import { Effect } from "./Effect";
import { GameCommonPool } from "../../../game-common/Script/GameCommon/GameCommonPool";

const { ccclass, property } = cc._decorator;
/**
 * Created by 郭荣凯
 * Time: 2019/04/22.
 * 玩家生成特效
 */
@ccclass
export class EnemySpawnEffect extends Effect {

    public onEnable(): void {
        let duration: number = this.anim.play().duration;
        let effect: Effect = this;
        this.scheduleOnce(() => {
            if (this.callBack) {
                this.callBack();
                this.callBack = null;
            }
        }, duration - 0.5);
        this.scheduleOnce(() => {
            GameCommonPool.returnInstant(effect.node);
        }, duration);
    }
}