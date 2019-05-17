const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        gameManager: GameManager;
    }
    export var gameManager: GameManager;
}

@ccclass
export class GameManager extends cc.Component {

    public onLoad(): void {
        window.gameManager = this;
    }

    private _timeScale: number = 1;

    public get timeScale(): number {
        return this._timeScale;
    }

    public setTimeScale(scale: number): void {
        this._timeScale = scale;
        cc.director.getScheduler().setTimeScale(scale);
    }

    private mPowerMax: number = 80;

    public get powerMax(): number {
        return this.mPowerMax;
    }

    private mGameVictory: boolean = false;

    public get gameVictory(): boolean {
        return this.mGameVictory;
    }

    public setGameResult(isVictory: boolean): void {
        this.mGameVictory = isVictory;
    }

    private mIsPlay: boolean = false;

    /**
     * 游戏运行状态
     */
    public get isPlay(): boolean {
        return this.mIsPlay;
    }

    private mIsStart: boolean = false;

    /**
     * 游戏开始状态
     */
    public get isStart(): boolean {
        return this.mIsStart;
    }

    private mCheckpointIndex: number = 1;

    /**
     * 关卡
     */
    public get checkpointIndex(): number {
        return this.mCheckpointIndex;
    }

    /**
     * 开始游戏
     */
    public startGame(): void {
        this._timeScale = 1;
        this.mIsPlay = true;
        this.mIsStart = true;
        this.deadEnemyCount = 0;
    }

    /**
     * 暂停游戏
     */
    public pauseGame(): void {
        this.mIsPlay = false;
    }

    /**
     * 继续游戏
     */
    public continueGame(): void {
        this.mIsPlay = true;
    }

    /**
     * 游戏结束
     */
    public gameOver(): void {
        this.mIsPlay = false;
        this.mIsStart = false;
    }

    /**
     * 下一关
     */
    public nextCheckpoint(): void {
        this.mCheckpointIndex++;
    }

    private mDeadEnemyCount: number = 0;

    public get maxEnemyCount(): number {
        return levelManager.getCurrentLevelEnemyCount();
    }

    public get deadEnemyCount(): number {
        return this.mDeadEnemyCount;
    }

    public set deadEnemyCount(value: number) {
        this.mDeadEnemyCount = value;
    }
}
