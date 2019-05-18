import { BaseUI } from "../../../../game-common/Script/UI/BaseUI";
import { UIPath } from "../../../common/UIPath";

const { ccclass, property } = cc._decorator;
enum GameBoardDoorAnim {
    CloseDoor = "closeDoor",
    OpenDoor = "openDoor",
}
@ccclass
export class BoardGame extends BaseUI {
    @property({ displayName: "延时开门时间" })
    delayOpenDoorTime: number = 1.5;
    @property(cc.Animation)
    doorAnim: cc.Animation = null;

    public onLoad(): void {

    }

    public onEnable(): void {
        this.initDoorAnim();

        this.delayShowBoard();
    }

    public update(): void {

    }

    public onDisable(): void {

    }
    //交互
    private clickTestBackBtn(): void {
        appContext.uiManager.showBoard(UIPath.BoardStart);
    }

    //逻辑
    private delayShowBoard(): void {
        this.scheduleOnce(this.playDoorAnim, this.delayOpenDoorTime);
    }

    //方法
    private initDoorAnim(): void {
        this.doorAnim.setCurrentTime(0, GameBoardDoorAnim.OpenDoor);
    }

    private playDoorAnim(): void {
        this.doorAnim.play(GameBoardDoorAnim.OpenDoor);
    }

    //显示
    private showLeftEnemy(): void {

    }

    private showHP(): void {

    }

    private showCoin(): void {

    }
}