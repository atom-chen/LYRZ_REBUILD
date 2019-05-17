
/**
 * Created by 郭荣凯
 * Time: 2019/04/016.
 * 武器数据
 */
export class WeaponData {
    public id: number = 0;

    public name: string = "";

    public level: number = 0;

    public infoList: Array<any> = new Array();

    public constructor(id: number, name: string, infoList: Array<any>) {
        this.id = id;
        this.name = name;
        this.infoList = infoList;
    }

    public getDamageByLevel(level: number): number {
        let info: any = this.infoList[level - 1];
        if (info) {
            return this.infoList[level - 1].Damage;
        }
        return 1;
    }

    public getCoinByLevel(level: number): number {
        let info: any = this.infoList[level - 1];
        if (info) {
            return this.infoList[level - 1].Coin;
        }
        return 0;
    }

    public get maxLevel(): number {
        return this.infoList.length;
    }
}