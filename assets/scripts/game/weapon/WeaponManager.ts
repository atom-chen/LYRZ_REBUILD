import { WeaponData } from "./WeaponData";

const { ccclass, property } = cc._decorator;
/**
 * Created by 郭荣凯
 * Time: 2019/04/16.
 * 武器管理类
 */

declare global {
    interface Window {
        weaponManager: WeaponManager;
    }
    export var weaponManager: WeaponManager;
}

@ccclass
export class WeaponManager extends cc.Component {

    private weaponMap: Map<number, WeaponData> = new Map();

    public onLoad() {
        window.weaponManager = this;
        StaticWeaponData.data.forEach(element => {
            let weaponData: WeaponData = new WeaponData(element.ID, element.Name, element.infoList);
            this.weaponMap.set(element.ID, weaponData);
        });
    }

    public getWeaponDataById(id: number): WeaponData {
        if (this.weaponMap.has(id)) {
            return this.weaponMap.get(id);
        }
        return null;
    }

    public getAllWeaponData(): Array<WeaponData> {
        let weaponList: Array<WeaponData> = new Array();
        this.weaponMap.forEach((value: WeaponData) => {
            weaponList.push(value);
        });
        return weaponList;
    }

    public getWeaponMaxLevel(id: number): number {
        if (this.weaponMap.has(id)) {
            return this.weaponMap.get(id).maxLevel;
        }
        return 0;
    }

    public checkWeaponUnlock(id: number): boolean {
        if (!appContext.playerData.hasWeapon(id)) {
            return appContext.playerData.getWeaponLevelByID(id - 1) >= 25;
        }
        return false;
    }
}