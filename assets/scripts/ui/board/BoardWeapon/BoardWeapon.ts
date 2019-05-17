import { BaseUI } from "../../../../game-common/Script/UI/BaseUI";
import { WeaponData } from "../../../game/weapon/WeaponData";
import { WeaponItem } from "./WeaponItem";
import { UIPath } from "../../../common/UIPath";
import { UserData } from "../../../../game-common/Script/GameCommon/UserData";

/**
 * Created by 郭荣凯
 * Time: 2019/04/016.
 * 武器升级界面
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class BoardWeapon extends BaseUI {

    @property({
        displayName: "武器预设父物体",
        type: cc.Node
    })
    private itemParent: cc.Node = null;

    @property({
        displayName: "好感度",
        type: cc.Node
    })
    private favorability: cc.Node = null;

    @property({
        displayName: "金币数",
        type: cc.Label
    })
    private coinLabel: cc.Label = null;

    @property({
        displayName: "体力数",
        type: cc.Label
    })
    private powerLabel: cc.Label = null;

    @property({
        displayName: "武器预设",
        type: cc.Prefab
    })
    private weaponPrefab: cc.Prefab = null;

    private upgradeItemList: Array<WeaponItem> = new Array();

    private allWeaponData: Array<WeaponData> = new Array();

    private laseCoin: number = 0;

    public onLoad(): void {
        this.allWeaponData = weaponManager.getAllWeaponData();
        for (const data of this.allWeaponData) {
            let ins: cc.Node = cc.instantiate(this.weaponPrefab);
            if (!ins) {
                continue;
            }
            ins.setParent(this.itemParent);
            ins.setPosition(cc.Vec2.ZERO);
            let upgradeItem: WeaponItem = ins.getComponent(WeaponItem);
            if (!upgradeItem) {
                continue;
            }
            upgradeItem.initData(data, this.updateData, this);
            this.upgradeItemList.push(upgradeItem);
        }
    }

    public onShow(): void {
        this.updateData();
    }

    private updateData(): void {
        for (let index = 0; index < this.allWeaponData.length; index++) {
            const data = this.allWeaponData[index];
            let item: WeaponItem = this.upgradeItemList[index];
            let coinNumber: number = data.getCoinByLevel(appContext.playerData.getWeaponLevelByID(data.id));
            item.updateData(coinNumber);
        }
    }

    public update(dt: number): void {
        if (UserData.data.coin != this.laseCoin) {
            this.coinLabel.string = UserData.data.coin + "";
            this.laseCoin = UserData.data.coin;
        }
    }

    private returnBtnClick(): void {
        appContext.uiManager.closeBoard();
        appContext.uiManager.showBoard(UIPath.BoardStart);
    }
}
