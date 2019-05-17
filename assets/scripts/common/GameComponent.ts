const { ccclass, property } = cc._decorator;

@ccclass
export class GameComponent extends cc.Component {

    public update(dt: number): void {
        this.gameUpdate(dt * gameManager.timeScale);
    }

    public gameUpdate(dt: number): void {

    }
}
