
const { ccclass, property } = cc._decorator;
/**
 * Created by 郭荣凯
 * Time: 2019/04/26.
 * 樱花粒子特效管理
 */
@ccclass
export class Sakura extends cc.Component {

    @property({
        displayName: "慢速樱花",
        type: cc.Prefab
    })
    private lowSakura: cc.Prefab = null;

    @property({
        displayName: "快速樱花",
        type: cc.Prefab
    })
    private fastSakura: cc.Prefab = null;

    private lastTimeScale: number = 0;

    private lowSakuraParticle: cc.ParticleSystem = null;

    private fastSakuraParticle: cc.ParticleSystem = null;

    public update(dt: number): void {
        if (this.lastTimeScale != gameManager.timeScale) {
            if (gameManager.timeScale < 1) {
                this.runLowSakura();
            } else {
                this.runFastSakura();
            }
            this.lastTimeScale = gameManager.timeScale;
        }
    }

    private runFastSakura(): void {
        let ins: cc.Node = cc.instantiate(this.fastSakura);
        if (!ins) {
            return;
        }
        ins.setParent(this.node);
        ins.setPosition(cc.Vec2.ZERO);
        this.fastSakuraParticle = ins.getComponent(cc.ParticleSystem);
        if (this.lowSakuraParticle != null) {
            this.lowSakuraParticle.stopSystem();
            this.lowSakuraParticle = null;
        }
    }

    private runLowSakura(): void {
        let ins: cc.Node = cc.instantiate(this.lowSakura);
        if (!ins) {
            return;
        }
        ins.setParent(this.node);
        ins.setPosition(cc.Vec2.ZERO);
        this.lowSakuraParticle = ins.getComponent(cc.ParticleSystem);
        if (this.fastSakuraParticle != null) {
            this.fastSakuraParticle.stopSystem();
            this.fastSakuraParticle = null;
        }
    }
}