import { MoreGameInfo } from "../MoreGame/MoreGameManager";
import { GameCommonUtil } from "./GameCommonUtil";

export class UserData {

    public static readonly storageKey: string = "userData";
    public static readonly maxFreeDialCard: number = 3;
    public static readonly maxShareDialCard: number = 2;
    public static readonly maxVideoDialCard: number = 50;
    public static readonly maxLuckyCard: number = 888;

    public static data: UserData = new UserData();

    public static init: boolean = false;//是否完成初始化数据

    public static newUser: boolean = true;//是否新玩家

    public static loadRemoteDataFail: boolean = false;//是否加载远程数据失败

    public static lastOnShowTime: number = 0;

    public playerId: string = GameCommonUtil.uuid();

    public openId: string = null;

    public coin: number = 0;

    public tryMoreGameInfos: MoreGameInfo[] = new Array();

    public assistRecordArray: Array<AssistRecord> = new Array();

    public assistanceTime: number = 0;//助力的时间

    public gameSound: boolean = true;//游戏音乐的开关，默认打开

    public otherData: any = null;

    public weixinadinfo: string = null;

    public adUserId: string = null;

    public adChannel: string = null;

    public loginRewardCanRecieveCount: number = 1;//登陆奖励可领取的数量
    public loginRewardRecievedCount: number = 0;//登陆奖励已领取的数量

    public lastLoginTime: number = Date.now();//上一次登陆的时间

    public freeDialCard: number = UserData.maxFreeDialCard;//免费转盘券数量
    public shareDialCard: number = UserData.maxShareDialCard;//分享转盘券数量
    public videoDialCard: number = UserData.maxVideoDialCard;//视频转盘券数量

    public levelShareSuccCount: number = 0;

    public selfLuckyCardCount: number = 0;//拥有的副卡数量
    public recieveLuckyCount: number = 0;//已领取福袋的次数
    public luckyOffsetValue: number = 1;//福袋剩余补偿值

    public recieveAddGameReward: boolean = false;

    public newUserForShare: boolean = true;//判断是否是新玩家，用于区分分享，每个游戏自行更新这个标识，默认是新用户

    //用户来源分类
    public newPlayerSourceType: number = null;
    //来源appId
    public sourceAppId: string = null;
    //用户创建时间（long）
    public createTimestamp: number = null;
    //用户质量（1：低质用户；2：有效用户；3：高质用户）
    public quality: number = 1;

    public static addTryMoreGame(moreGameInfo: MoreGameInfo) {
        if (moreGameInfo == null) {
            return;
        }
        if (this.data.tryMoreGameInfos.indexOf(moreGameInfo) != -1) {
            return;
        }
        var index = -1;
        for (var tryMoreGameInfo of this.data.tryMoreGameInfos) {
            if (tryMoreGameInfo.gameAppId == moreGameInfo.gameAppId) {
                index = this.data.tryMoreGameInfos.indexOf(tryMoreGameInfo);
                break;
            }
        }
        if (index == -1) {
            this.data.tryMoreGameInfos.push(moreGameInfo);
        } else {
            this.data.tryMoreGameInfos[index] = moreGameInfo;
        }
    }

    public static isHasReward(gameAppId: string): boolean {
        if (gameAppId == null) {
            return true;
        }
        for (var tryMoreGameInfo of this.data.tryMoreGameInfos) {
            if (tryMoreGameInfo.gameAppId == gameAppId) {
                if (!tryMoreGameInfo.hasReward) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 获取助力的次数
     * @param assistId 助力活动id
     */
    public static getAssistanceCount(assistId: string): number {
        for (var assistRecord of this.data.assistRecordArray) {
            if (assistRecord.assistId == assistId) {
                return assistRecord.assistanceCount;
            }
        }
        return 0;
    }

    /**
     * 增加助力次数
     * @param assistId 助力活动id
     * @param count 
     */
    public static addAssistanceCount(assistId: string, count: number): void {
        if (this.data.assistanceTime != 0 && !GameCommonUtil.isToday(this.data.assistanceTime)) {
            this.data.assistanceTime = Date.now();
            for (var assistRecord of this.data.assistRecordArray) {
                assistRecord.assistanceCount = 0;
            }
        }
        if (this.data.assistanceTime == 0) {
            this.data.assistanceTime = Date.now();
        }
        for (var assistRecord of this.data.assistRecordArray) {
            if (assistRecord.assistId == assistId) {
                assistRecord.assistanceCount += count;
                return;
            }
        }
        var newAssistRecord = new AssistRecord();
        newAssistRecord.assistId = assistId;
        newAssistRecord.assistanceCount = count;
        this.data.assistRecordArray.push(newAssistRecord);
    }

    /**
     * 领取福袋
     * @param count 福袋中福卡数量
     */
    public static recieveLuckyPacket(count: number): void {
        this.data.selfLuckyCardCount += count;
        if (this.data.selfLuckyCardCount >= this.maxLuckyCard) {
            this.data.selfLuckyCardCount = this.maxLuckyCard - 1;
        }
        this.data.recieveLuckyCount++;
    }

    /**
     * 获取下一次福袋中福卡的数量
     */
    public static getNextLuckyCardCount(): number {
        //800以后不再可以获取福卡了
        if (this.data.selfLuckyCardCount > 800) {
            return 0;
        }
        //750以后每次只能获取1张福卡了
        if (this.data.selfLuckyCardCount > 750) {
            return 1;
        }
        //700以后每次只能获取2张福卡了
        if (this.data.selfLuckyCardCount > 700) {
            return 2;
        }

        if (this.data.recieveLuckyCount < 3) {
            let averageValue = 3.5 / 3;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 10) {
            let averageValue = 4 / 7;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 20) {
            let averageValue = 2.5 / 10;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 30) {
            let averageValue = 2 / 10;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 40) {
            let averageValue = 1.4 / 10;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 50) {
            let averageValue = 1.3 / 10;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 60) {
            let averageValue = 1.2 / 10;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 70) {
            let averageValue = 1.1 / 10;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else if (this.data.recieveLuckyCount < 80) {
            let averageValue = 1 / 10;
            let redOffsetValue = this.data.luckyOffsetValue / 5;
            let randomValue = Math.random() * redOffsetValue * 2 - redOffsetValue;
            let recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            if (recieveValue <= averageValue / 2) {
                randomValue = -randomValue;
                recieveValue = Math.floor((averageValue + randomValue) * 100) / 100;
            }
            this.data.luckyOffsetValue -= randomValue;
            return Math.ceil(recieveValue * 42);
        } else {
            return 2;
        }
    }

    public static getJsonStr(): string {
        var str = JSON.stringify(this.data);
        console.log(str);
        return str;
    }

    public static parseFromStr(jsonStr: string): void {

        this.init = true;

        if (jsonStr == null || jsonStr == "" || typeof jsonStr != "string") {
            return;
        }

        this.newUser = false;

        try {
            var jsonData = JSON.parse(jsonStr);

            if (jsonData == null) {
                return;
            }

            if (jsonData.playerId != null) {
                this.data.playerId = jsonData.playerId;
            }
            if (jsonData.openId != null) {
                this.data.openId = jsonData.openId;
            }
            if (jsonData.coin != null) {
                this.data.coin = jsonData.coin;
            }
            if (jsonData.gameSound != null) {
                this.data.gameSound = jsonData.gameSound;
            }
            if (jsonData.recieveLuckyCount != null) {
                this.data.recieveLuckyCount = jsonData.recieveLuckyCount;
            }
            if (jsonData.selfLuckyCardCount != null) {
                this.data.selfLuckyCardCount = jsonData.selfLuckyCardCount;
            }
            if (jsonData.luckyOffsetValue != null) {
                this.data.luckyOffsetValue = jsonData.luckyOffsetValue;
            }
            if (jsonData.tryMoreGameInfos != null && (this.data.tryMoreGameInfos == null || this.data.tryMoreGameInfos.length == 0)) {
                this.data.tryMoreGameInfos = jsonData.tryMoreGameInfos;
            }
            if (jsonData.assistanceTime != null && jsonData.assistRecordArray != null) {
                var assistanceTime = jsonData.assistanceTime;
                if (GameCommonUtil.isToday(assistanceTime)) {
                    this.data.assistRecordArray = jsonData.assistRecordArray;
                    this.data.assistanceTime = jsonData.assistanceTime;
                }
            }
            if (jsonData.otherData != null) {
                this.data.otherData = jsonData.otherData;
            }
            if (jsonData.weixinadinfo != null) {
                this.data.weixinadinfo = jsonData.weixinadinfo;
            }
            if (jsonData.adUserId != null) {
                this.data.adUserId = jsonData.adUserId;
            }
            if (jsonData.adChannel != null) {
                this.data.adChannel = jsonData.adChannel;
            }

            if (jsonData.loginRewardRecievedCount != null) {
                this.data.loginRewardRecievedCount = jsonData.loginRewardRecievedCount;
            }
            if (jsonData.loginRewardCanRecieveCount != null) {
                this.data.loginRewardCanRecieveCount = jsonData.loginRewardCanRecieveCount;
            }
            if (jsonData.lastLoginTime != null) {
                if (!GameCommonUtil.isToday(jsonData.lastLoginTime)) {
                    //如果不是同一天则可领取奖励次数+1
                    this.data.loginRewardCanRecieveCount = this.data.loginRewardRecievedCount + 1;
                    this.data.freeDialCard = UserData.maxFreeDialCard;
                    this.data.shareDialCard = UserData.maxShareDialCard;
                    this.data.videoDialCard = UserData.maxVideoDialCard;
                } else {
                    if (jsonData.freeDialCard != null) {
                        this.data.freeDialCard = jsonData.freeDialCard;
                    }
                    if (jsonData.shareDialCard != null) {
                        this.data.shareDialCard = jsonData.shareDialCard;
                    }
                    if (jsonData.videoDialCard != null) {
                        this.data.videoDialCard = jsonData.videoDialCard;
                    }
                }
            }
            this.data.lastLoginTime = Date.now();

            if (jsonData.levelShareSuccCount != null) {
                this.data.levelShareSuccCount = jsonData.levelShareSuccCount;
            }

            if (jsonData.recieveAddGameReward != null) {
                this.data.recieveAddGameReward = jsonData.recieveAddGameReward;
            }

            if (jsonData.newUserForShare != null) {
                this.data.newUserForShare = jsonData.newUserForShare;
            }

            if (jsonData.newPlayerSourceType != null) {
                this.data.newPlayerSourceType = jsonData.newPlayerSourceType;
            }

            if (jsonData.createTimestamp != null) {
                this.data.createTimestamp = jsonData.createTimestamp;
            }

            if (jsonData.sourceAppId != null) {
                this.data.sourceAppId = jsonData.sourceAppId;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 福袋测试
     */
    public static redPacketTest(): void {
        UserData.data.recieveLuckyCount = 0;
        UserData.data.selfLuckyCardCount = 0;
        UserData.data.luckyOffsetValue = 1;
        for (let i = 0; i < 80; i++) {
            let value = UserData.getNextLuckyCardCount();
            UserData.data.recieveLuckyCount++;
            UserData.data.selfLuckyCardCount += value;
            // console.log(value);
            if (value <= 0) {
                console.error(value);
            }
        }
        console.log(UserData.data.selfLuckyCardCount);
        if (UserData.data.selfLuckyCardCount > 750) {
            console.warn(UserData.data.selfLuckyCardCount);
        }
        if (UserData.data.selfLuckyCardCount > 800) {
            console.error(UserData.data.selfLuckyCardCount);
        }
    }
}

export class AssistRecord {
    //助力活动的id
    public assistId: string = null;
    //今日已获得助力的数量
    public assistanceCount: number = 0;
}
