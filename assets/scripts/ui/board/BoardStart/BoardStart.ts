import { BaseUI } from "../../../../game-common/Script/UI/BaseUI";
import { UIPath } from "../../../common/UIPath";

const { ccclass, property } = cc._decorator;
enum StartBoardRoleAnim {
    StandAnim = "standAnim",
    JumpAnim = "jumpAnim",
}
enum StartBoardDoorAnim {
    CloseDoor = "closeDoor",
    OpenDoor = "openDoor",
}
@ccclass
export class BoardStart extends BaseUI {
    @property(cc.Animation)
    roleAnim: cc.Animation = null;
    @property(cc.Animation)
    doorAnim: cc.Animation = null;

    public onLoad(): void {

    }

    public onEnable(): void {
        this.initDoorAnim();
        this.initRoleAnim();
    }

    public update(): void {

    }

    public onDisable(): void {

    }
    //交互
    private clickStartBtn(): void {
        this.startGame();
    }

    private clickWeaponShopBtn(): void {

    }

    private clickSkillShopBtn(): void {

    }

    //逻辑
    private startGame(): void {
        this.playRoleAnim(() => {
            this.playDoorAnim(this.showGameBoard, this);
        }, this);
    }
    //方法
    private initDoorAnim(): void {
        this.doorAnim.setCurrentTime(0, StartBoardDoorAnim.CloseDoor);
    }

    private initRoleAnim(): void {
        this.roleAnim.play(StartBoardRoleAnim.StandAnim);
    }

    private playRoleAnim(endCallback: () => void = null, caller: any = null): void {
        this.roleAnim.play(StartBoardRoleAnim.JumpAnim);
        endCallback && this.roleAnim.once(cc.Animation.EventType.FINISHED, endCallback, caller);
    }

    private playDoorAnim(endCallback: () => void = null, caller: any = null): void {
        this.doorAnim.play(StartBoardDoorAnim.CloseDoor);
        endCallback && this.doorAnim.once(cc.Animation.EventType.FINISHED, endCallback, caller);
    }

    private showGameBoard(): void {
        appContext.uiManager.showBoard(UIPath.BoardGame);
    }

    //显示

}