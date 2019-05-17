import { GameCommonPool } from "../../../game-common/Script/GameCommon/GameCommonPool";
import { PropItem } from "./PropItem";
import { PropData } from "./PropData";
import { PropUseEnum } from "./PropUseEnum";
import { RoleType } from "../role/RoleType";
import { ApplyType } from "../skill/ApplyType";
import { PropEnum } from "./PropEnum";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        propController: PropController;
    }
    export var propController: PropController;
}

@ccclass
export class PropController extends cc.Component {

    @property({
        displayName: "攻击技能道具",
        type: cc.Prefab
    })
    private attackSkillPrefab: cc.Prefab = null;

    @property({
        displayName: "药物道具",
        type: cc.Prefab
    })
    private drugPrefab: cc.Prefab = null;

    @property({
        displayName: "缴械道具",
        type: cc.Prefab
    })
    private disarmProp: cc.Prefab = null;

    @property({
        displayName: "加速道具",
        type: cc.Prefab
    })
    private acceleratProp: cc.Prefab = null;

    @property({
        displayName: "影分身",
        type: cc.Prefab
    })
    private soulBodyProp: cc.Prefab = null;

    /**
     * 道具列表
     */
    private propList: Array<PropItem> = new Array();

    public onLoad(): void {
        window.propController = this;
    }

    private propIndex: number = 0;

    public spawProp(propId: number, worldPosition: cc.Vec2): void {
        switch (propId) {
            case PropEnum.PROP_ATTACK:
                propController.spawnAttackSkillProp(worldPosition);
                break;
            case PropEnum.PROP_DRUG:
                propController.spawnDrugProp(worldPosition);
                break;
            case PropEnum.PROP_DISARM:
                propController.spawnDisarmProp(worldPosition);
                break;
            case PropEnum.PROP_ACCELERAT:
                propController.spawnAcceleratProp(worldPosition);
                break;
            case PropEnum.PROP_SOUL_BODY:
                propController.spawnSoulBodyPropCoinProp(worldPosition);
                break;
            default:
                break;
        }
    }

    /**
     * 生成攻击技能道具
     * @param worldPosition 生成坐标
     */
    public spawnAttackSkillProp(worldPosition: cc.Vec2): void {
        let prop: PropItem = this.spawPropPrefab(this.attackSkillPrefab, worldPosition);
        if (!prop) {
            return;
        }
        let propData: PropData = new PropData();
        propData.id = PropEnum.PROP_ATTACK;
        propData.durationTime = 10;
        propData.propUseType = PropUseEnum.ATTACK_SKILL;
        propData.icon = appContext.spriteManager.getPropIconByID(propData.id);
        propData.namePicture = appContext.spriteManager.getPropNameByID(propData.id);
        prop.initData(this.propIndex, propData);
        this.propList.push(prop);
    }

    /**
     * 生成药品道具
     * @param worldPosition 生成坐标
     */
    public spawnDrugProp(worldPosition: cc.Vec2): void {
        let prop: PropItem = this.spawPropPrefab(this.drugPrefab, worldPosition);
        if (!prop) {
            return;
        }
        let propData: PropData = new PropData();
        propData.id = PropEnum.PROP_DRUG;
        propData.durationTime = 0.5;
        propData.propUseType = PropUseEnum.DRUG;
        propData.hp = 1;
        propData.icon = appContext.spriteManager.getPropIconByID(propData.id);
        propData.namePicture = appContext.spriteManager.getPropNameByID(propData.id);
        prop.initData(this.propIndex, propData);
        this.propList.push(prop);
    }

    /**
     * 生成缴械道具
     * @param worldPosition 
     */
    public spawnDisarmProp(worldPosition: cc.Vec2): void {
        let prop: PropItem = this.spawPropPrefab(this.disarmProp, worldPosition);
        if (!prop) {
            return;
        }
        let propData: PropData = new PropData();
        propData.id = PropEnum.PROP_DISARM;
        propData.durationTime = 5;
        propData.propUseType = PropUseEnum.DISARM;
        propData.targetType = RoleType.Enemy;
        propData.applyType = ApplyType.FullScreenTarget;
        propData.icon = appContext.spriteManager.getPropIconByID(propData.id);
        propData.namePicture = appContext.spriteManager.getPropNameByID(propData.id);
        prop.initData(this.propIndex, propData);
        this.propList.push(prop);
    }

    /**
     * 生成加速道具
     * @param worldPosition 
     */
    public spawnAcceleratProp(worldPosition: cc.Vec2): void {
        let prop: PropItem = this.spawPropPrefab(this.acceleratProp, worldPosition);
        if (!prop) {
            return;
        }
        let propData: PropData = new PropData();
        propData.id = PropEnum.PROP_ACCELERAT;
        propData.durationTime = 5;
        propData.propUseType = PropUseEnum.SPEED;
        propData.valuePercent = 200;
        propData.targetType = RoleType.Enemy;
        propData.applyType = ApplyType.FullScreenTarget;
        propData.icon = appContext.spriteManager.getPropIconByID(propData.id);
        propData.namePicture = appContext.spriteManager.getPropNameByID(propData.id);
        prop.initData(this.propIndex, propData);
        this.propList.push(prop);
    }

    /**
     * 生成影分身道具
     * @param worldPosition 
     */
    public spawnSoulBodyPropCoinProp(worldPosition: cc.Vec2): void {
        let prop: PropItem = this.spawPropPrefab(this.soulBodyProp, worldPosition);
        if (!prop) {
            return;
        }
        let propData: PropData = new PropData();
        propData.id = PropEnum.PROP_SOUL_BODY;
        propData.durationTime = 0;
        propData.propUseType = PropUseEnum.SOUL_BODY;
        propData.durationTime = 3;
        propData.count = 2;
        propData.targetType = RoleType.Player;
        propData.applyType = ApplyType.None;
        propData.icon = appContext.spriteManager.getPropIconByID(propData.id);
        propData.namePicture = appContext.spriteManager.getPropNameByID(propData.id);
        prop.initData(this.propIndex, propData);
        this.propList.push(prop);
    }

    private spawPropPrefab(prefab: cc.Prefab, worldPosition: cc.Vec2): PropItem {
        let ins: cc.Node = GameCommonPool.requestInstant(prefab);
        if (!ins) {
            return null;
        }
        ins.setParent(nodeManager.propPanel);
        ins.position = worldPosition;
        let prop: PropItem = ins.getComponent(PropItem);
        this.propIndex++;
        return prop;
    }

    /**
     * 清除道具
     */
    public despawnProp(propIndex: number): void {
        for (let index = 0; index < this.propList.length; index++) {
            const prop = this.propList[index];
            if (prop.propData == null) {
                this.propList.splice(index, 1);
                prop.recycle();
                continue;
            }
            if (propIndex === prop.index) {
                this.propList.splice(index, 1);
                prop.recycle();
                break;
            }
        }
    }

    /**
     * 清除所有道具
     */
    public clearAllProp(): void {
        for (let index = this.propList.length - 1; index >= 0; index--) {
            const element = this.propList[index];
            element.recycle();
        }
        this.propList = new Array();
    }
}
