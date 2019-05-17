import { UIManager } from "../game-common/Script/UI/UIManager";
import { SpriteManager } from "./game/SpriteManager";
import { PlayerData } from "./data/PlayerData";
import { UserData } from "../game-common/Script/GameCommon/UserData";
import { Util } from "./tool/Util";
import { WorldEventManager } from "../game-common/Script/GameCommon/WorldEventManager";
import { WorldEventType } from "../game-common/Script/GameCommon/WorldEventType";
import { UIPath } from "./common/UIPath";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        appContext: AppContext;
    }
    export var appContext: AppContext;
}

@ccclass
export class AppContext extends cc.Component {
    @property(UIManager)
    private uiManagerScript: UIManager = null;

    public get uiManager(): UIManager {
        return this.uiManagerScript;
    }

    private powerTimer: number = 0;

    private powerTime: number = 10;

    public onLoad(): void {
        window.appContext = this;
        cc.game.addPersistRootNode(this.node);
        cc.director.getCollisionManager().enabled = true;
    }

    public start(): void {
        appContext.uiManager.showBoard(UIPath.BoardStart);
    }

    public update(dt: number): void {
        if (!PlayerData.init) {
            return;
        }
        if (appContext.playerData.power >= gameManager.powerMax) {
            appContext.playerData.power = gameManager.powerMax;
            this.powerTimer = 0;
            return;
        }
        if (this.powerTimer < this.powerTime) {
            this.powerTimer += dt;
        } else {
            this.playerData.power += 1;
            this.powerTimer = 0;
        }
    }

    public get playerData(): PlayerData {
        if (!UserData.init) {
            console.error("此时userData还未初始化,调用逻辑错误，应在userdata初始化后进行调用");
            return null;
        }
        if (!UserData.data.otherData) {
            UserData.data.otherData = PlayerData.initData();
            PlayerData.init = true;
        } else if (!PlayerData.init) {
            PlayerData.init = true;
            //第二次之后进入游戏，此时应该把otherData转化为playerData
            UserData.data.otherData = PlayerData.parseFromObject(UserData.data.otherData);
        }
        return UserData.data.otherData;
    }
}