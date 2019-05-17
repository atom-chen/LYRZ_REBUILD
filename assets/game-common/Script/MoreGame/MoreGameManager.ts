import { MoreGame } from "./MoreGame";
import { GameCommonPool } from "../GameCommon/GameCommonPool";
import { GameCommonHttp } from "../GameCommon/GameCommonHttp";
import { UserData } from "../GameCommon/UserData";
import { TipManager } from "../Tip/TipManager";
import { GameConfig } from "../GameCommon/GameCommon";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { GameCommonUtil } from "../GameCommon/GameCommonUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export class MoreGameManager extends cc.Component {

    protected static instance: MoreGameManager = null;

    @property(cc.Prefab)
    protected moreGamePrefab: cc.Prefab = null;

    protected moreGameNode: cc.Node = null;

    protected readonly moreGameArray: MoreGameInfo[] = new Array();

    protected clickAction: (moreGameInfo: MoreGameInfo) => void = null;

    protected static rewardNum: number = 5000;//每个游戏的试玩奖励

    onLoad(): void {
        MoreGameManager.instance = this;
    }

    /**
     * @return boolean 返回试玩界面是否在显示
     */
    public static isShow(): boolean {
        if (this.instance == null) {
            return false;
        }
        if (this.instance.moreGameNode == null) {
            return false;
        }
        if (!this.instance.moreGameNode.active) {
            return false;
        }
        return true;
    }

    /**
     * 设置试玩奖励，设置后会自动刷新试玩界面上的奖励
     * @param rewardNum 每个游戏的试玩奖励
     */
    public static setReward(rewardNum: number): void {
        this.rewardNum = rewardNum;
        var manager = this.instance;
        if (manager == null) {
            return;
        }
        manager.moreGameArray.forEach(moreGameInfo => {
            moreGameInfo.rewardNum = rewardNum;
        });
        this.reset();
    }

    /**
     * 刷新试玩界面,仅刷新奖励
     */
    public static reset(): void {
        var manager = this.instance;
        if (manager == null) {
            return;
        }
        if (manager.moreGameNode == null) {
            return;
        }
        var moreGame = manager.moreGameNode.getComponent(MoreGame);
        if (moreGame == null) {
            return;
        }
        for (var moreGameInfo of manager.moreGameArray) {
            moreGame.resetReward(moreGameInfo);
        }
    }

    protected clickMoreGame(): void {

        if (this.moreGameNode != null) {
            this.moreGameNode.active = true;
            return;
        }

        this.clickAction = function (moreGameInfo: MoreGameInfo): void {
            console.log(moreGameInfo);
            if (moreGameInfo == null) {
                return;
            }
            StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "playerClick");
            //小游戏自带跳转
            var jumpCallBack = function (success: boolean): void {
                if (!success) {
                    //跳转失败后判断是否需要二维码跳转
                    if (moreGameInfo.switchQRCode) {
                        window.gameCommon.getSDK.previewImage(moreGameInfo.QRCode);
                    }
                    return;
                }
                //没有奖励则记录下来，退出游戏1分钟后可以领取
                if (moreGameInfo.hasReward) {
                    moreGameInfo.tryGameTime = Date.now();
                    UserData.addTryMoreGame(moreGameInfo);
                } else {
                    TipManager.showTip("已经领取过奖励了~");
                }
                StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "jumpSuccess");
            }
            window.gameCommon.getSDK.navigateToMiniProgram(moreGameInfo.gameAppId, moreGameInfo.jumpPath, jumpCallBack);
        }

        var instant = GameCommonPool.requestInstant(this.moreGamePrefab);
        if (instant == null) {
            return;
        }
        instant.setParent(this.node);
        this.moreGameNode = instant;
        var moreGame = instant.getComponent(MoreGame);
        if (moreGame == null) {
            return;
        }
        moreGame.bindData(this.moreGameArray, this.clickAction);
    }

    public static initMoreGameConfig(): void {

        var manager = this.instance;
        if (manager == null) {
            return;
        }

        var url = "https://hffile.ttigd.cn/game-common/" + GameConfig.wxAppName + "/moreGameConfig.txt?time=" + Date.now();

        var callBack = function (retCode: number, retData: any): void {
            if (retCode != 0 || retData == null) {
                return;
            }
            var moreGames = retData.moreGames;
            if (moreGames != null) {
                for (var moreGame of moreGames) {
                    if (!moreGame._jumpSwith) {
                        continue;
                    }
                    manager.addMoreGame(moreGame._name, moreGame._jumpImageUrl, moreGame._jumpAppId, moreGame._jumpPath, moreGame._jumpSwith, moreGame._redDot, moreGame._QRCode, moreGame._switchQRCode);
                }
            }

            //判断是否可以获取试玩奖励
            for (var moreGameInfo of UserData.data.tryMoreGameInfos) {
                if (moreGameInfo.hasReward) {
                    if (moreGameInfo.tryGameTime != 0) {
                        var intervalTime = Date.now() - moreGameInfo.tryGameTime;
                        console.log(intervalTime);
                        if (intervalTime >= 60 * 1000) {
                            moreGameInfo.hasReward = false;
                            UserData.data.coin += moreGameInfo.rewardNum;
                            TipManager.showTip("试玩成功，获得" + GameCommonUtil.getShotNumberStr(moreGameInfo.rewardNum) + "金币");
                            StatisticsManager.uploadJumpRecord(moreGameInfo.gameAppId, moreGameInfo.gameName, "rewardSuccess");
                        } else {
                            moreGameInfo.tryGameTime = 0;
                            TipManager.showTip("试玩1分钟才可获得奖励哦~");
                        }
                    }
                } else {
                    if (moreGameInfo.tryGameTime != 0) {
                        if (!GameCommonUtil.isToday(moreGameInfo.tryGameTime)) {
                            moreGameInfo.tryGameTime = 0;
                            moreGameInfo.hasReward = true;
                        }
                    }
                }
            }
            MoreGameManager.reset();
        };
        GameCommonHttp.wxHttpGet(url, callBack);
    }

    protected addMoreGame(gameName: string, gameIconUrl: string, gameAppId: string, jumpPath: string, switchControl: boolean, redPoint: boolean, QRCode: string, switchQRCode: boolean): void {
        var moreGameInfo = new MoreGameInfo(gameName, gameIconUrl, gameAppId, jumpPath, switchControl, redPoint, QRCode, switchQRCode);
        moreGameInfo.hasReward = UserData.isHasReward(gameAppId);
        moreGameInfo.rewardNum = MoreGameManager.rewardNum;
        this.moreGameArray.push(moreGameInfo);
    }
}

export class MoreGameInfo {
    public gameName: string;
    public gameIconUrl: string;
    public gameAppId: string;
    public jumpPath: string;
    public switchControl: boolean;
    public redPoint: boolean;
    public hasReward: boolean = true;
    public tryGameTime: number = 0;
    public rewardNum: number = 0;
    public QRCode: string = null;
    public switchQRCode: boolean = false;

    constructor(gameName: string, gameIconUrl: string, gameAppId: string, jumpPath: string, switchControl: boolean, redPoint: boolean, QRCode: string, switchQRCode: boolean) {
        this.gameName = gameName;
        this.gameIconUrl = gameIconUrl;
        this.gameAppId = gameAppId;
        this.jumpPath = jumpPath;
        this.switchControl = switchControl;
        this.redPoint = redPoint;
        this.QRCode = QRCode;
        this.switchQRCode = switchQRCode;
    }
}
