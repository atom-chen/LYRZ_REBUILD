import { GameCommonPool } from "../GameCommon/GameCommonPool";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class BaseUI extends cc.Component {

    public onShow(args: Array<any> = null): void {

    }

    public onResume() {

    }

    public onHide() {

    }

    public onClose() {
        GameCommonPool.returnInstant(this.node);
    }
}
