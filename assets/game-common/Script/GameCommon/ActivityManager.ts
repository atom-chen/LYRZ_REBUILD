import { GameCommonPool } from "./GameCommonPool";

const {ccclass, property} = cc._decorator;

@ccclass
export class ActivityManager extends cc.Component {

    @property(cc.Prefab)
    protected assistPrefab: cc.Prefab = null;

    protected pickGameClickTime: number = 0;

    protected assistNode: cc.Node = null;

    protected clickAssist(): void {
        if (this.assistNode != null) {
            this.assistNode.active = true;
            return;
        }
        var instant = GameCommonPool.requestInstant(this.assistPrefab);
        if (instant == null) {
            return;
        }
        instant.setParent(this.node);
        this.assistNode = instant;
    }
}
