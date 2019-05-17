import { UserData } from "../../../../game-common/Script/GameCommon/UserData";
import { SkillData } from "../../../game/skill/SkillData";

const { ccclass, property } = cc._decorator;
/**
 * Created by 郭荣凯
 * Time: 2019/04/017.
 * 技能、武器升级预设
 */
@ccclass
export class PassiveSkillItem extends cc.Component {

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

    private skillData: SkillData = null;

    private callBack: () => void = null;

    private caller: any = null;

    public initData(data: SkillData, callBack: () => void, caller: any): void {
        let unLock: boolean = appContext.playerData.hasWeapon(data.id);
        this.upgradeButton.active = unLock;
        let icon: cc.SpriteFrame = appContext.spriteManager.getSkillIconByID(data.id);
        // let coinNumber: number = data.getCoinByLevel(appContext.playerData.getWeaponLevelByID(data.id));
        this.skillData = data;
        this.nameLabel.string = data.name;
        this.icon.spriteFrame = icon;
        // this.coinLabel.string = coinNumber + "";
        // this.coinNumber = coinNumber;
        this.callBack = callBack;
        this.caller = caller;
    }

    public updateData(coinNumber: number): void {
        let unLock: boolean = appContext.playerData.hasWeapon(this.skillData.id);
        this.coinLabel.string = coinNumber + "";
        this.upgradeButton.active = unLock;
    }

    private upgradeBtnClick(): void {
        if (this.skillData.level >= this.skillData.maxLevel) {
            return;
        }
        // if (UserData.data.coin < this.coinNumber) {
        //     return;
        // }
        // UserData.data.coin -= this.coinNumber;
        this.skillData.level++;
        appContext.playerData.upgradeWeaponLevel(this.skillData.id, this.skillData.level);
        // this.coinLabel.string = this.skillData.getCoinByLevel(this.skillData.level) + "";
        if (appContext.playerData.currentWeaponID != this.skillData.id) {
            appContext.playerData.currentWeaponID = this.skillData.id;
        }
        if (weaponManager.checkWeaponUnlock(this.skillData.id + 1)) {
            appContext.playerData.setWeaponLevelByID(this.skillData.id + 1);
            if (this.callBack) {
                this.callBack.call(this.caller);
            }
        }
    }
}
