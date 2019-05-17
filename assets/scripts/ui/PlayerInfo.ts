import { UserData } from "../../game-common/Script/GameCommon/UserData";

import { PlayerData } from "../data/PlayerData";

/**
 * Created by 郭荣凯
 * Time: 2019/05/06.
 * 玩家体力金币信息显示
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class PlayerInfo extends cc.Component {

    @property({
        displayName: "金币文本",
        type: cc.Label
    })
    private coinLabel: cc.Label = null;

    @property({
        displayName: "体力文本",
        type: cc.Label
    })
    private powerLabel: cc.Label = null;

    private lastCoin: number = 0;

    private lastPower: number = 0;

    public update(): void {
        if (!UserData.init || !PlayerData.init) {
            return;
        }
        if (this.lastCoin != UserData.data.coin) {
            this.lastCoin = UserData.data.coin;
            this.coinLabel.string = this.lastCoin + "";
        }
        if (this.lastPower != appContext.playerData.power) {
            this.lastPower = appContext.playerData.power;
            this.powerLabel.string = this.lastPower + "";
        }
    }
}
