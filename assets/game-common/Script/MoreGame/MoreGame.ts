import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { MoreGameItem } from "./MoreGameItem";
import { MoreGameInfo } from "./MoreGameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class MoreGame extends cc.Component {

    @property(cc.Node)
    protected bg: cc.Node = null;

    @property(cc.Node)
    protected board: cc.Node = null;

    @property(cc.Node)
    protected closeNode: cc.Node = null;

    @property(cc.Node)
    protected moreGameContent: cc.Node = null;

    @property(cc.Node)
    protected qualityGameContent: cc.Node = null;

    @property(cc.Prefab)
    protected moreGameItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    protected qualityGameItemPrefab: cc.Prefab = null;

    protected originalPosition: cc.Vec2 = null;

    protected originalWidth: number = 0;

    protected gameItemMap: Map<MoreGameInfo, MoreGameItem> = new Map();

    protected show: boolean = false;

    onLoad(): void {
        this.originalPosition = this.board.position.clone();
        this.originalWidth = this.board.width;
    }

    onEnable(): void {
        this.board.x -= this.originalWidth;
        this.showMoreGame();
    }

    public bindData(moreGameArray: MoreGameInfo[], clickAction: (moreGameInfo: MoreGameInfo) => void): void {

        if (moreGameArray == null) {
            return;
        }

        var count = moreGameArray.length;

        if (count <= 3) {
            this.board.height = 710 * 0.85;
        }

        if (count <= 5) {
            for (var moreGameInfo of moreGameArray) {
                this.createQualityeGameItem(moreGameInfo, clickAction);
            }
        }

        if (count > 5 && count <= 9) {
            for (var i = 0; i < count; i++) {
                if (i < 4) {
                    this.createQualityeGameItem(moreGameArray[i], clickAction);
                } else {
                    this.createMoreGameItem(moreGameArray[i], clickAction);
                }
            }
        }

        if (count > 9 && count <= 13) {
            this.moreGameContent.y += 137 * 0.85; 
            for (var i = 0; i < count; i++) {
                if (i < 3) {
                    this.createQualityeGameItem(moreGameArray[i], clickAction);
                } else {
                    this.createMoreGameItem(moreGameArray[i], clickAction);
                }
            }
        }

        if (count > 13 && count <= 18) {
            this.board.height += 145 * 0.85;
            this.moreGameContent.y += 137 * 0.85; 
            for (var i = 0; i < count; i++) {
                if (i < 3) {
                    this.createQualityeGameItem(moreGameArray[i], clickAction);
                } else {
                    this.createMoreGameItem(moreGameArray[i], clickAction);
                }
            }
        }

        if (count > 18) {
            this.board.height += 165 * 0.85;
            this.moreGameContent.y += 130 * 2 * 0.85; 
            for (var i = 0; i < count; i++) {
                if (i < 2) {
                    this.createQualityeGameItem(moreGameArray[i], clickAction);
                } else if (i < 22) {
                    this.createMoreGameItem(moreGameArray[i], clickAction);
                }
            }
        }
    }

    public resetReward(moreGameInfo: MoreGameInfo): void {
        var gameItem = this.gameItemMap.get(moreGameInfo);
        if (gameItem == null) {
            return;
        }
        gameItem.refreshReward();
    }

    protected createMoreGameItem(moreGameInfo: MoreGameInfo, clickAction: (moreGameInfo: MoreGameInfo) => void): void {
        var instant = GameCommonPool.requestInstant(this.moreGameItemPrefab);
        if (instant == null) {
            return;
        }
        instant.setParent(this.moreGameContent);
        var gameItem = instant.getComponent(MoreGameItem);
        if (gameItem == null) {
            return;
        }
        this.gameItemMap.set(moreGameInfo, gameItem);
        gameItem.bindData(moreGameInfo, clickAction);
    }


    protected createQualityeGameItem(moreGameInfo: MoreGameInfo, clickAction: (moreGameInfo: MoreGameInfo) => void): void {
        var instant = GameCommonPool.requestInstant(this.qualityGameItemPrefab);
        if (instant == null) {
            return;
        }
        instant.setParent(this.qualityGameContent);
        var gameItem = instant.getComponent(MoreGameItem);
        if (gameItem == null) {
            return;
        }
        this.gameItemMap.set(moreGameInfo, gameItem);
        gameItem.bindData(moreGameInfo, clickAction);
    }

    protected showMoreGame(): void {
        if (this.show) {
            return;
        }
        this.closeNode.opacity = 0;
        this.show = true;
        var self = this;
        this.board.runAction(cc.sequence(
            cc.moveTo(0.5, this.originalPosition).easing(cc.easeQuarticActionOut()),
            cc.callFunc(function () {
                self.closeNode.runAction(cc.fadeIn(0.3));    
            })
        ));
        this.bg.opacity = 0;
        this.bg.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.fadeTo(0.5, 177)
        ));
    }

    protected showCloseMoreGame(): void {
        if (!this.show) {
            return;
        }
        this.show = false;
        var self = this;
        this.board.runAction(cc.sequence(
            cc.moveBy(0.5, cc.v2(-this.originalWidth, 0)).easing(cc.easeQuadraticActionOut()),
            cc.callFunc(function () {
                self.node.active = false;
            })
        ));
    }

    protected clickClose(): void {
        this.showCloseMoreGame();
    }
}
