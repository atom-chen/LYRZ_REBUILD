const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonInterval extends cc.Component {
    @property({ displayName: "按钮间隔恢复时间" })
    interval: number = 1;

    private button: cc.Button = null;
    private cliclEvent: cc.Component.EventHandler = null;

    public onLoad(): void {
        this.button = this.node.getComponent(cc.Button);
        if (!this.button) {
            return;
        }
        this.cliclEvent = new cc.Component.EventHandler();
        this.cliclEvent.target = this.node;
        this.cliclEvent.component = "ButtonInterval";
        this.cliclEvent.handler = "closeBtnOpenSecond";

        this.button.clickEvents.push(this.cliclEvent);
    }

    private closeBtnOpenSecond(): void {
        this.unscheduleAllCallbacks();
        this.button.interactable = false;
        this.scheduleOnce(() => {
            this.button.interactable = true;
        }, this.interval);
    }
}
