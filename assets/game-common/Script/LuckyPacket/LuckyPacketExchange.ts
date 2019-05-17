import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { UserData } from "../GameCommon/UserData";
import { ShareManager } from "../ShareCommon/ShareManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class LuckyPacketExchange extends cc.Component {

    @property(cc.Label)
    private selfLuckyCardCount: cc.Label = null;

    public onEnable(): void {
        if (!ShareManager.getLuckyPacketControl()) {
            this.clickClose();
            return;
        }
        this.selfLuckyCardCount.string = UserData.data.selfLuckyCardCount + '';
    }

    private clickClose(): void {
        GameCommonPool.returnInstant(this.node);
    }

    private clickExchange(): void {
        window.gameCommon.getSDK.showWxModal("兑换失败", "福卡不足,快去集福卡吧~", () => {

        }, null);
    }
}
