import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { BaseUI } from "./BaseUI";
import { TipManager } from "../Tip/TipManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class UIManager extends cc.Component {

    @property(cc.Node)
    private boardNode: cc.Node = null;

    @property(cc.Node)
    private dialogNode: cc.Node = null;

    @property(cc.Node)
    private tipNode: cc.Node = null;

    private boardStack: Array<UIWrapper> = new Array();

    private dialogStack: Array<UIWrapper> = new Array();

    private tipStack: Array<UIWrapper> = new Array();

    private preBoardArray: Array<BoardData> = new Array();

    private preDialogArray: Array<BoardData> = new Array();

    private preTipArray: Array<BoardData> = new Array();

    private loading: boolean = false;

    public update(dt: number): void {
        if (this.loading) {
            return;
        }

        if (this.preBoardArray.length > 0) {
            var boardData = this.preBoardArray.shift();
            this.spawnBoard(boardData);
            return;
        }

        if (this.preDialogArray.length > 0) {
            var dialogData = this.preDialogArray.pop();
            this.spawnDialog(dialogData);
            return;
        }

        if (this.preTipArray.length > 0) {
            var tipData = this.preTipArray.pop();
            this.spawnTip(tipData);
        }
    }

    private spawnBoard(boardData: BoardData): void {
        if (!boardData) {
            return;
        }

        let url = boardData.url;
        for (let i = 0; i < this.boardStack.length; i++) {
            let board = this.boardStack[i];
            if (board.url == url) {
                if (i == this.boardStack.length - 1) {
                    return;
                }
                this.boardStack.splice(i, 1);
                if (this.boardStack.length > 0) {
                    let last = this.boardStack[this.boardStack.length - 1];
                    last.ui.onHide();
                    last.node.active = false;
                }
                board.node.active = true;
                board.ui.onResume();
                this.boardStack.push(board);
                return;
            };
        }

        this.loading = true;
        var self = this;
        GameCommonPool.requestInstantByUrl(boardData.url, function (err, instant) {

            self.loading = false;

            if (instant == null) {
                return;
            }

            //关闭当前所有dialog
            self.clearDialog();

            //隐藏当前board 
            let boardStack = self.boardStack;
            if (boardStack.length > 0) {
                let first = boardStack[self.boardStack.length - 1];
                first.ui.onHide();
                first.node.active = false;
            }

            instant.setParent(self.boardNode);
            instant.position = cc.Vec2.ZERO;
            instant.scale = 1;

            let uiScript = instant.getComponent(BaseUI);
            if (!uiScript) {
                console.error("没有获得BaseUI组件:" + boardData.url);
                return;
            }
            uiScript.onShow(boardData.args);
            self.boardStack.push(new UIWrapper(boardData.url, uiScript, uiScript.node));
        });
    }

    public closeBoard(): void {
        //关闭当前board 
        let boardStack = this.boardStack;
        if (boardStack.length > 0) {
            let first = boardStack.pop();
            first.ui.onClose();
            GameCommonPool.returnInstant(first.node);
        }

        //显示上一个Board
        if (boardStack.length > 0) {
            let first = boardStack[boardStack.length - 1];
            first.ui.onResume();
            first.node.active = true;
        }
    }

    private spawnDialog(dialogData: BoardData) {
        if (!dialogData) {
            return;
        }

        let url = dialogData.url;
        for (let i = 0; i < this.dialogStack.length; i++) {
            let dialog = this.dialogStack[i];
            if (dialog.url == url) {
                if (i == this.dialogStack.length - 1) {
                    return;
                }
                this.dialogStack.splice(i, 1);
                if (this.dialogStack.length > 0) {
                    let last = this.dialogStack[this.dialogStack.length - 1];
                    last.ui.onHide();
                    last.node.active = false;
                }
                dialog.node.active = true;
                dialog.ui.onResume();
                this.dialogStack.push(dialog);
                return;
            };
        }

        this.loading = true;
        var self = this;
        GameCommonPool.requestInstantByUrl(dialogData.url, function (err, instant) {
            if (!instant) {
                console.error("not find object in path:" + dialogData.url);
            }
            self.loading = false;

            //隐藏当前 dialog
            let dialogStack = self.dialogStack;
            if (dialogStack.length > 0) {
                let first = dialogStack[self.dialogStack.length - 1];
                first.ui.onHide();
                first.node.active = false;
            }

            instant.setParent(self.dialogNode);
            instant.position = cc.Vec2.ZERO;
            instant.scale = 1;

            let uiScript = instant.getComponent(BaseUI);
            if (!uiScript) {
                console.error("没有获得BaseUI组件:" + dialogData.url);
                return;
            }
            uiScript.onShow(dialogData.args);
            self.dialogStack.push(new UIWrapper(dialogData.url, uiScript, uiScript.node));
        });
    }

    public closeDialog(): void {
        let dialogStack = this.dialogStack;
        if (dialogStack.length > 0) {
            let first = dialogStack.pop();
            first.ui.onClose();
            GameCommonPool.returnInstant(first.node);
        }

        if (dialogStack.length > 0) {
            let first = dialogStack[dialogStack.length - 1];
            first.ui.onResume();
            first.node.active = true;
        }
    }

    private spawnTip(tipData: BoardData) {
        if (!tipData) {
            return;
        }

        let url = tipData.url;
        for (let i = 0; i < this.tipStack.length; i++) {
            let tip = this.tipStack[i];
            if (tip.url == url) {
                if (i == this.tipStack.length - 1) {
                    return;
                }
                this.tipStack.splice(i, 1);
                if (this.tipStack.length > 0) {
                    let last = this.tipStack[this.tipStack.length - 1];
                    last.ui.onHide();
                    last.node.active = false;
                }
                tip.node.active = true;
                tip.ui.onResume();
                this.tipStack.push(tip);
                return;
            };
        }

        this.loading = true;
        var self = this;
        GameCommonPool.requestInstantByUrl(tipData.url, function (err, instant) {
            if (!instant) {
                console.error("not find object in path:" + tipData.url);
            }
            self.loading = false;

            //隐藏当前 dialog
            let tipStack = self.tipStack;
            if (tipStack.length > 0) {
                let first = tipStack[self.tipStack.length - 1];
                first.ui.onHide();
                first.node.active = false;
            }

            instant.setParent(self.tipNode);
            instant.position = cc.Vec2.ZERO;
            instant.scale = 1;

            let uiScript = instant.getComponent(BaseUI);
            if (!uiScript) {
                console.error("没有获得BaseUI组件:" + tipData.url);
                return;
            }
            uiScript.onShow(tipData.args);
            self.tipStack.push(new UIWrapper(tipData.url, uiScript, uiScript.node));
        });
    }

    public closeTip(): void {
        let tipStack = this.tipStack;

        if (tipStack.length > 0) {
            let first = tipStack.pop();
            first.ui.onClose();
            GameCommonPool.returnInstant(first.node);
        }

        if (tipStack.length > 0) {
            let first = tipStack[tipStack.length - 1];
            first.ui.onResume();
            first.node.active = true;
        }
    }

    public showBoard(boardUrl: string, args?: Array<any>): void {
        console.log('Show board: ' + boardUrl);
        var boardData = new BoardData(boardUrl, args);
        this.preBoardArray.push(boardData);
    }

    public showDialogSync(url: string, args?: Array<any>): void {
        var dialogData = new BoardData(url, args);
        this.spawnDialog(dialogData);
    }

    public showDialog(url: string, args?: Array<any>): void {
        var dialogData = new BoardData(url, args);
        this.preDialogArray.push(dialogData);
    }

    // public showDialogShare(isWatch: boolean, titleLabel: string, rewardLabel: string, icon: number | cc.SpriteFrame, callBack: () => void, cancelCallBack?: () => void): void {
    //     let arr: Array<any> = new Array();
    //     arr.push(isWatch);
    //     arr.push(titleLabel);
    //     arr.push(rewardLabel);
    //     arr.push(icon);
    //     arr.push(callBack);
    //     arr.push(cancelCallBack);
    //     var tipData = new BoardData(UIPaths.DialogShare, arr);
    //     this.preDialogArray.push(tipData);
    // }

    // public showDoubleReward(titleLabel: string, rewardName: string, rewardNum: number, icon: number | cc.SpriteFrame, callBack: () => void, cancelCallBack?: () => void): void {
    //     let arr: Array<any> = new Array();
    //     arr.push(titleLabel);
    //     arr.push(rewardName);
    //     arr.push(rewardNum);
    //     arr.push(icon);
    //     arr.push(callBack);
    //     arr.push(cancelCallBack);
    //     var dialogData = new BoardData(UIPaths.DoubleReward, arr);
    //     this.preDialogArray.push(dialogData);
    // }

    public showTipCommon(tipUrl: string, titleLabel: string, rewardLabel: string, icon: number | cc.SpriteFrame, callBack: () => void, cancelCallBack?: () => void): void {
        console.log('Show tip: ' + tipUrl);
        let arr: Array<any> = new Array();
        arr.push(titleLabel);
        arr.push(rewardLabel);
        arr.push(icon);
        arr.push(callBack);
        arr.push(cancelCallBack);
        var tipData = new BoardData(tipUrl, arr);
        this.preTipArray.push(tipData);
    }

    public toast(content: string, showTime: number) {
        TipManager.showToast(content);
    }

    public clearBoard(): void {
        this.clearDialog();
        while (this.boardStack.length > 0) {
            let board = this.boardStack.pop();
            board.ui.onClose();
            GameCommonPool.returnInstant(board.node);
        }
    }

    public clearDialog() {
        while (this.dialogStack.length > 0) {
            let dialog = this.dialogStack.pop();
            dialog.ui.onClose();
            GameCommonPool.returnInstant(dialog.node);
        }
    }

    public clearTip(): void {
        while (this.tipStack.length > 0) {
            let dialog = this.tipStack.pop();
            dialog.ui.onClose();
            GameCommonPool.returnInstant(dialog.node);
        }
    }
}

export class BoardData {
    private _url: string = null;
    public get url(): string {
        return this._url;
    }
    public set url(value: string) {
        this._url = value;
    }
    private _args: Array<any> = null;
    public get args(): Array<any> {
        return this._args;
    }
    public set args(value: Array<any>) {
        this._args = value;
    }

    constructor(url: string, args: Array<any>) {
        this.url = url;
        this.args = args;
    }
}

export class UIWrapper {
    private _url_1: string;
    public get url(): string {
        return this._url_1;
    }

    private _ui: BaseUI;
    public get ui(): BaseUI {
        return this._ui;
    }

    private _node: cc.Node;
    public get node(): cc.Node {
        return this._node;
    }

    constructor(url: string, ui: BaseUI, node: cc.Node) {
        this._url_1 = url;
        this._ui = ui;
        this._node = node;
    }
}
