import { SkillData } from "../../../game/skill/SkillData";
import { UserData } from "../../../../game-common/Script/GameCommon/UserData";
import { UIPath } from "../../../common/UIPath";
import { BaseUI } from "../../../../game-common/Script/UI/BaseUI";
import { PassiveSkillItem } from "./PassiveSkillItem";

const { ccclass, property } = cc._decorator;
/**
 * Created by 郭荣凯
 * Time: 2019/04/017.
 * 技能升级界面
 */
@ccclass
export class BoardPassiveSkill extends BaseUI {

    @property({
        displayName: "技能预设父物体",
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
        displayName: "技能预设",
        type: cc.Prefab
    })
    private skillPrefab: cc.Prefab = null;

    private upgradeItemList: Array<PassiveSkillItem> = new Array();

    private allSkillData: Array<SkillData> = new Array();

    private laseCoin: number = 0;

    public onLoad(): void {
        this.allSkillData = skillManager.getAllSkillData();
        for (const data of this.allSkillData) {
            let ins: cc.Node = cc.instantiate(this.skillPrefab);
            if (!ins) {
                continue;
            }
            ins.setParent(this.itemParent);
            ins.setPosition(cc.Vec2.ZERO);
            let upgradeItem: PassiveSkillItem = ins.getComponent(PassiveSkillItem);
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
        for (let index = 0; index < this.allSkillData.length; index++) {
            const data = this.allSkillData[index];
            let item: PassiveSkillItem = this.upgradeItemList[index];
            // let coinNumber: number = data.getCoinByLevel(appContext.playerData.getWeaponLevelByID(data.id));
            item.updateData(0);
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
