import { GameCommonUtil } from "../../game-common/Script/GameCommon/GameCommonUtil";

/**
 * Created by 郭荣凯
 * Time: 2019/04/16.
 * 玩家数据类
 */
export class PlayerData {
    public static init: boolean = false;    //是否初始化完成

    public power: number = 80;

    public currentLevel: number = 1;

    public currentWeaponID: number = 1;

    public ownWeaponArray: Array<[number, number]> = new Array();

    public LoginTime: number = 0;//数组刷新同一参考时间

    public firstStartGame: boolean = true;//第一次进入游戏（直接开始第一关）

    public static initData(): PlayerData {
        let playerData = new PlayerData();
        playerData.ownWeaponArray.push([1, 1]);
        return playerData;
    }

    public static parseFromObject(json: any): PlayerData {
        let playerData = new PlayerData();
        if (json) {
            if (json.currentWeaponID != null) {
                playerData.currentWeaponID = json.currentWeaponID;
            }
            if (json.currentLevel != null) {
                playerData.currentLevel = json.currentLevel;
            }
            if (json.power != null) {
                playerData.power = json.power;
            }
            if (json.ownWeaponArray != null) {
                for (let [id, level] of json.ownWeaponArray) {
                    if (!playerData.hasWeapon(id)) {
                        playerData.ownWeaponArray.push([id, level]);
                    }
                }
            }
            if (json.LoginTime != null) {
                playerData.LoginTime = json.LoginTime;
                if (GameCommonUtil.isToday(playerData.LoginTime) == false) {
                    //此处刷新第二天需要刷新的数据
                    //...
                }
                playerData.LoginTime = Date.now();
            }
            if (json.firstStartGame != null) {
                playerData.firstStartGame = json.firstStartGame;
            }
        }
        return playerData;
    }

    public hasWeapon(weaponID: number): boolean {
        for (const [id, level] of this.ownWeaponArray) {
            if (id === weaponID) {
                return true;
            }
        }
        return false;
    }

    public setWeaponLevelByID(weaponID: number): void {
        if (this.hasWeapon(weaponID)) {
            return;
        }
        this.ownWeaponArray.push([weaponID, 1]);
    }

    public getWeaponLevelByID(weaponID: number): number {
        for (const [id, level] of this.ownWeaponArray) {
            if (id === weaponID) {
                return level;
            }
        }
        return 0;
    }

    public upgradeWeaponLevel(weaponID: number, weaponLevel: number): void {
        for (let weapon of this.ownWeaponArray) {
            if (weapon[0] === weaponID) {
                if (weaponLevel > weapon[1]) {
                    weapon[1] = weaponLevel;
                }
            }
        }
    }
}