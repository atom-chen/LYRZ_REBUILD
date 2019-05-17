import { BaseUI } from "../../../../game-common/Script/UI/BaseUI";
import { UIPath } from "../../../common/UIPath";

const { ccclass, property } = cc._decorator;

@ccclass
export class DialogSettlement extends BaseUI {

    @property(cc.Node)
    private successNode: cc.Node = null;

    @property(cc.Node)
    private defeatedNode: cc.Node = null;

    @property(cc.Node)
    private doubleBtnNode: cc.Node = null;

    @property(cc.Label)
    private awardPowerLabel: cc.Label = null;

    @property(cc.Label)
    private receiveCoinLabel: cc.Label = null;

    @property(cc.Label)
    private residueLabel: cc.Label = null;

    @property(cc.Label)
    private defeatedCoinLabel: cc.Label = null;

    public onShow(): void {
        if (gameManager.gameVictory) {
            this.successNode.active = true;
            this.defeatedNode.active = false;
            appContext.playerData.power += 5;
            levelManager.currentLevel++;
        } else {
            this.defeatedNode.active = true;
            this.successNode.active = false;
            this.residueLabel.string = Math.ceil(((gameManager.maxEnemyCount - gameManager.deadEnemyCount) / gameManager.maxEnemyCount) * 100) + "";
        }

    }

    private doubelBtnClick(): void {
        appContext.uiManager.closeBoard();
        appContext.uiManager.showBoard(UIPath.BoardStart);
    }

    private receoveBtnClick(): void {
        appContext.uiManager.closeBoard();
        appContext.uiManager.showBoard(UIPath.BoardStart);
        cc.director.loadScene("start");
    }
}
