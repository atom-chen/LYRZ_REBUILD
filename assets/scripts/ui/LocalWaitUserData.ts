import { UserData } from "../../game-common/Script/GameCommon/UserData";
import { MoreGameManager } from "../../game-common/Script/MoreGame/MoreGameManager";
import { WorldEventManager } from "../../game-common/Script/GameCommon/WorldEventManager";
import { WorldEventType } from "../../game-common/Script/GameCommon/WorldEventType";

const { ccclass, property } = cc._decorator;

@ccclass
export class LocalWaitUserData extends cc.Component {

    protected runTime: number = 0;

    update(dt: number): void {

        this.runTime += dt;

        //5秒后自动超时结束转圈
        if (this.runTime >= 2.5 || cc.sys.isBrowser) {
            UserData.loadRemoteDataFail = true;
            MoreGameManager.initMoreGameConfig();
            WorldEventManager.triggerEvent(WorldEventType.GetUserDataFinish, null);
            this.node.active = false;
            return;
        }

        if (!UserData.init) {
            return;
        }
        MoreGameManager.initMoreGameConfig();
        WorldEventManager.triggerEvent(WorldEventType.GetUserDataFinish, null);
        this.node.active = false;
    }
}
