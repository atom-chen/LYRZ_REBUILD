const { ccclass, property } = cc._decorator;

@ccclass
export class TransmitTouch extends cc.Component {

    @property([cc.Component.EventHandler])
    protected clickEvents: cc.Component.EventHandler[] = new Array();

    onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (this.clickEvents == null) {
                return;
            }
            cc.Component.EventHandler.emitEvents(this.clickEvents, event);
        });
        this.node._touchListener.setSwallowTouches(false);
    }
}
