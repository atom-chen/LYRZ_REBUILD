import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { Dial } from "./Dial";

const { ccclass, property } = cc._decorator;

@ccclass
export class DialManager extends cc.Component {

    protected static instance: DialManager = null;

    @property({
        type: cc.Prefab,
        displayName: "轮盘预设"
    })
    protected dialPrefab: cc.Prefab = null;

    protected dialNode: cc.Node = null;

    onLoad(): void {
        DialManager.instance = this;
    }

    /**
     * 加载轮盘游戏
     * @param dialItems 轮盘元素数据组
     * @param rewardAction 抽中奖励后执行的action
     * @param randomAction: () => number 自定义抽奖的概率,返回抽到的奖品索引index，不设置使用默认概率，所有奖品概率相同
     */
    public static showDial(dialItems: Array<DialItemData>, rewardAction: (itemType: number | string, itemCount: number) => void, randomAction: () => number = null): void {
        var manager = this.instance;

        if (manager == null) {
            return;
        }

        var dialNode = GameCommonPool.requestInstant(manager.dialPrefab);
        manager.dialNode = dialNode;

        if (dialNode == null) {
            return;
        }

        dialNode.setParent(manager.node);

        var dial = dialNode.getComponent(Dial);
        if (dial != null) {
            dial.bindData(dialItems, rewardAction, randomAction);
        }
    }

    /**
     * 轮盘界面是否显示中
     * @return boolean
     */
    public static isDialShow(): boolean {

        var manager = this.instance;

        if (manager == null) {
            return false;
        }

        return manager.dialNode != null && manager.dialNode.active;
    }
}

/**
 * 轮盘元素数据
 */
export class DialItemData {

    public itemType: number | string;
    public itemName: string;
    public itemSpriteFrame: cc.SpriteFrame = null;
    public itemCount: number = 0;
    public itemScale: number = 1;

    /**
     * 生成轮盘元素数据
     * @param itemType 奖励的道具类型
     * @param itemName 奖励的名称
     * @param itemSpriteFrame 奖励的道具图
     * @param itemCount 奖励的道具数量
     * @param itemScale 奖励图片的缩放，默认为1原始大小
     */
    constructor(itemType: number | string, itemName: string, itemSpriteFrame: cc.SpriteFrame, itemCount: number, itemScale: number = 1) {
        this.itemType = itemType;
        this.itemName = itemName;
        this.itemSpriteFrame = itemSpriteFrame;
        this.itemCount = itemCount;
        this.itemScale = itemScale;
    }
}
