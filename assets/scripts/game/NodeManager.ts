import { Util } from "../tool/Util";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        nodeManager: NodeManager;
    }
    export var nodeManager: NodeManager;
}

@ccclass
export class NodeManager extends cc.Component {

    @property(cc.Node)
    private viewPanelNode: cc.Node = null;

    public get viewPanel(): cc.Node {
        return this.viewPanelNode;
    }

    @property({
        displayName: "技能层",
        type: cc.Node
    })
    private skillPanelNode: cc.Node = null;

    public get skillPanel(): cc.Node {
        return this.skillPanelNode;
    }

    @property({
        displayName: "残影父节点",
        type: cc.Node
    })
    private mGhostPartnerNode: cc.Node = null;

    public get ghostPartnerNode(): cc.Node {
        return this.mGhostPartnerNode;
    }

    @property({
        displayName: "特效层",
        type: cc.Node
    })
    private effectPanelNode: cc.Node = null;

    public get effectPanel(): cc.Node {
        return this.effectPanelNode;
    }

    @property({
        displayName: "道具层",
        type: cc.Node
    })
    private propPanelNode: cc.Node = null;

    public get propPanel(): cc.Node {
        return this.propPanelNode;
    }

    @property({
        displayName: "蒙版遮罩层",
        type: cc.Node
    })
    private maskPanelNode: cc.Node = null;

    public get maskPanel(): cc.Node {
        return this.maskPanelNode;
    }

    @property({
        displayName: "锁定动画父节点",
        type: cc.Node
    })
    private mAttackSpottingNode: cc.Node = null;

    public get attackSpottingNode(): cc.Node {
        return this.mAttackSpottingNode;
    }

    @property({
        displayName: "角色父节点",
        type: cc.Node
    })
    private mRolParentNode: cc.Node = null;

    public get rolParentNode(): cc.Node {
        return this.mRolParentNode;
    }
    private mValidAtkRect: cc.Rect = new cc.Rect();

    private frameCount: number = 0;

    public onLoad(): void {
        window.nodeManager = this;
        this.scheduleOnce(() => {
            this.mValidAtkRect = this.viewPanelNode.getBoundingBoxToWorld();
            this.mValidAtkRect = cc.rect(this.mValidAtkRect.x + 25, this.mValidAtkRect.y + 40, this.mValidAtkRect.width - 50, this.mValidAtkRect.height - 50);
        });
    }

    public update(dt: number): void {
        if (++this.frameCount % 6 === 0) {
            this.sortChildrenByY();
        }
    }

    /**
     * 有效范围
     */
    public get validRect(): cc.Rect {
        return this.mValidAtkRect;
    }

    private sortChildrenByY(): void {
        let listToSort: Array<cc.Node> = this.rolParentNode.children.slice();
        listToSort.sort(function (a, b) {
            return b.y - a.y;
        });
        for (let i = 0; i < listToSort.length; ++i) {
            let node = listToSort[i];
            if (node.active) {
                node.setSiblingIndex(i);
            }
        }
    }
}
