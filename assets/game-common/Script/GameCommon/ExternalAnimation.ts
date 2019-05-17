const { ccclass, property } = cc._decorator;

@ccclass
export class ExternalAnimation extends cc.Component {

    @property(cc.Node)
    protected in: cc.Node = null;

    @property(cc.Node)
    protected out: cc.Node = null;

    onLoad() {

        if (this.in == null || this.out == null) {
            return;
        }

        this.in.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 0.8), cc.scaleTo(0.5, 1.2).easing(cc.easeElasticOut(0.5)))));

        this.schedule(function () {

            this.out.stopAllActions();
            this.out.scale = 0;
            this.out.opacity = 255;

            this.out.runAction(cc.scaleTo(0.5, 3));
            this.out.runAction(cc.fadeOut(0.5).easing(cc.easeCircleActionIn()));

        }, 0.7)
    }

    onEnable() {
        this.in.active = true;
        this.out.active = true;
    }
}
