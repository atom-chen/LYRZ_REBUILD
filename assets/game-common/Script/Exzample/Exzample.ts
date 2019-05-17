import { DialManager, DialItemData } from "../Dial/DialManager";
import { TipManager } from "../Tip/TipManager";
import { DayliLoginManager } from "../DayliLoginReward/DayliLoginManager";
import { DayliLoginItemData } from "../DayliLoginReward/DayliLogin";
import { UserData } from "../GameCommon/UserData";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { ShareManager, ShareControlType } from "../ShareCommon/ShareManager";
import { GameConfig } from "../GameCommon/GameCommon";
import { AdManager } from "../AdManager/AdManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class Exzample extends cc.Component {

    @property(cc.SpriteFrame)
    private coinIcon: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private diamondIcon: cc.SpriteFrame = null;

    @property(cc.Prefab)
    private exchangePrefab: cc.Prefab = null;

    @property({
        displayName: "通用组件版本号"
    })
    private version: string = "1.0.0";

    private testReward: number = 100;

    start() {
        // this.pickCoinExzample();
        // this.dialExzample();
        this.dayliLoginExzample();
        // this.taskExzample();
    }

    private dialExzample(): void {

        var dialItems: Array<DialItemData> = new Array();

        var itemData1 = new DialItemData(1, "小袋金币1", this.coinIcon, 50, 1);
        var itemData2 = new DialItemData(1, "小袋金币2", this.coinIcon, 50, 1);
        var itemData3 = new DialItemData(1, "中袋金币3", this.coinIcon, 100, 1);
        var itemData4 = new DialItemData(1, "大袋金币4", this.coinIcon, 200, 1);
        var itemData5 = new DialItemData(2, "小袋钻石5", this.diamondIcon, 5, 1.5);
        var itemData6 = new DialItemData(2, "小袋钻石6", this.diamondIcon, 5, 1.5);

        dialItems.push(itemData1);
        dialItems.push(itemData2);
        dialItems.push(itemData3);
        dialItems.push(itemData5);
        dialItems.push(itemData6);
        dialItems.push(itemData4);

        var rewardAction = function (itemType: number | string, itemCount: number): void {
            if (itemType == 1) {
                TipManager.showTip("恭喜获得" + itemCount + "金币！");
            } else if (itemType == 2) {
                TipManager.showTip("恭喜获得" + itemCount + "钻石！");
            }
        }

        //指定抽奖概率每次都抽到第一个物品
        var randomAction = function (): number {
            return 0;
        }

        DialManager.showDial(dialItems, rewardAction, randomAction);
    }

    private dayliLoginExzample(): void {

        let clickRecieveAction = (itemData: DayliLoginItemData, isDoubble: boolean, successCall: () => void) => {

            if (itemData == null) {
                return;
            }

            if (isDoubble) {
                TipManager.showTip("恭喜获得" + itemData.itemName + "x" + (itemData.itemCount * 2));
            } else {
                TipManager.showTip("恭喜获得" + itemData.itemName + "x" + itemData.itemCount);
            }

            if (successCall != null) {
                successCall();
            }
        }

        let itemDatas = new Array();
        let itemData1 = new DayliLoginItemData(1, "小袋金币", this.coinIcon, 50, 1);
        let itemData2 = new DayliLoginItemData(1, "中袋金币", this.coinIcon, 100, 1);
        let itemData3 = new DayliLoginItemData(1, "中袋金币", this.coinIcon, 100, 1);
        let itemData4 = new DayliLoginItemData(1, "大袋金币", this.coinIcon, 200, 1);
        let itemData5 = new DayliLoginItemData(2, "小袋钻石", this.diamondIcon, 5, 1);
        let itemData6 = new DayliLoginItemData(2, "中袋钻石", this.diamondIcon, 10, 1);
        let itemData7 = new DayliLoginItemData(2, "大袋钻石", this.diamondIcon, 20, 1);

        itemDatas.push(itemData1);
        itemDatas.push(itemData2);
        itemDatas.push(itemData3);
        itemDatas.push(itemData4);
        itemDatas.push(itemData5);
        itemDatas.push(itemData6);
        itemDatas.push(itemData7);

        DayliLoginManager.showDayliLogin(itemDatas, clickRecieveAction);
    }

    private clickPrize(): void {
        let exchangeNode = GameCommonPool.requestInstant(this.exchangePrefab);
        exchangeNode.setParent(this.node);
    }

    /**
     * 分享开关 示例
     */
    private shareControlExzample(): void {
        
        let shareControlType = ShareManager.getShareControlType();

        let succFunc = () => {
        };

        //case 1: 分享和视频都关闭，应用于审核和特殊情况，直接获取成功结果
        if (shareControlType == ShareControlType.ShareAndAdClose) {
            succFunc();
            return;
        }

        let watchVideFunc = () => {
            AdManager.showVideoAd(
                () => {
                    succFunc();
                },
                () => {
                    TipManager.showTip("看完视频才可以领取奖励哦~");
                });
        }

        //case 2: 分享区分新老用户 并且 玩家是新用户 使用观看视频替换分享
        if ((GameConfig.diffUserForShare && UserData.data.newUserForShare)) {
            watchVideFunc();
            return;
        }

        //case 3: 分享关闭或者（违规分享关闭同时此处是违规分享） 使用观看视频替换分享
        if (shareControlType == ShareControlType.ShareCloseAndAdOpen || shareControlType == ShareControlType.VolationShareCloseAndAdOpen) {
            watchVideFunc();
            return;
        }

        //case 4: 正常情况，分享打开
        window.gameCommon.getSDK.share("", null, null, (res: any, success: boolean) => {
            if (success) {
                succFunc();
            }
        }, true);
    }

    private addWxSmallGameReward(): void {
        console.log("获得收藏奖励" + this.testReward);
    }
}
