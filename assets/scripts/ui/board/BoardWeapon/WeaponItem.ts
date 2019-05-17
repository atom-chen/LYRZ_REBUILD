import { UserData } from "../../../../game-common/Script/GameCommon/UserData";
import { WeaponData } from "../../../game/weapon/WeaponData";

const { ccclass, property } = cc._decorator;
/**
 * Created by 郭荣凯
 * Time: 2019/04/016.
 * 技能、武器升级预设
 */
@ccclass
export class WeaponItem extends cc.Component {

    @property({
        displayName: "名字",
        type: cc.Label
    })
    private nameLabel: cc.Label = null;

    @property({
        displayName: "金币数",
        type: cc.Label
    })
    private coinLabel: cc.Label = null;

    @property({
        displayName: "图标",
        type: cc.Sprite
    })
    private icon: cc.Sprite = null;

    @property({
        displayName: "升级按钮",
        type: cc.Node
    })
    private upgradeButton: cc.Node = null;

    private coinNumber: number = 0;

    private weaponData: WeaponData = null;

    private callBack: () => void = null;

    private caller: any = null;

    public initData(data: WeaponData, callBack: () => void, caller: any): void {
        let unLock: boolean = appContext.playerData.hasWeapon(data.id);
        this.upgradeButton.active = unLock;
        let icon: cc.SpriteFrame = appContext.spriteManager.getWeaponIconByID(data.id);
        let coinNumber: number = data.getCoinByLevel(appContext.playerData.getWeaponLevelByID(data.id));
        this.weaponData = data;
        this.nameLabel.string = data.name;
        this.icon.spriteFrame = icon;
        this.coinLabel.string = coinNumber + "";
        this.coinNumber = coinNumber;
        this.callBack = callBack;
        this.caller = caller;
    }

    public updateData(coinNumber: number): void {
        let unLock: boolean = appContext.playerData.hasWeapon(this.weaponData.id);
        this.coinLabel.string = coinNumber + "";
        this.upgradeButton.active = unLock;
    }

    private upgradeBtnClick(): void {
        if (this.weaponData.level >= this.weaponData.maxLevel) {
            return;
        }
        // if (UserData.data.coin < this.coinNumber) {
        //     return;
        // }
        // UserData.data.coin -= this.coinNumber;
        this.weaponData.level++;
        appContext.playerData.upgradeWeaponLevel(this.weaponData.id, this.weaponData.level);
        this.coinLabel.string = this.weaponData.getCoinByLevel(this.weaponData.level) + "";
        if (appContext.playerData.currentWeaponID != this.weaponData.id) {
            appContext.playerData.currentWeaponID = this.weaponData.id;
        }
        if (weaponManager.checkWeaponUnlock(this.weaponData.id + 1)) {
            appContext.playerData.setWeaponLevelByID(this.weaponData.id + 1);
            if (this.callBack) {
                this.callBack.call(this.caller);
            }
        }
    }
}
