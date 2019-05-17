import { GameCommonUtil } from "../GameCommon/GameCommonUtil";
import { GameConfig } from "../GameCommon/GameCommon";
import { CarouseRotate } from "./CarouseRotate";
import { StatisticsManager } from "../StatisticsManager/StatisticsManager";
import { GameCommonHttp } from "../GameCommon/GameCommonHttp";

const { ccclass, property } = cc._decorator;

enum CarouselButtonType {
    More = 0,
}

@ccclass
export class CarouselButton extends cc.Component {
    @property({
        type: cc.Enum(CarouselButtonType)
    })
    protected moreBtnType: CarouselButtonType = CarouselButtonType.More;

    @property(cc.Sprite)
    protected currentSpriteConfig: cc.Sprite = null;

    public get currentSprite(): cc.Sprite {
        return this.currentSpriteConfig;
    }

    @property(CarouseRotate)
    protected rotate: CarouseRotate = null;

    @property(cc.Float)
    protected switchTime: number = 15;

    protected _configJsonData: any = null;

    protected _spriteUrlArr: string[] = [];

    protected _spriteArr: cc.SpriteFrame[] = [];

    protected _currentIndex: number = 0;

    protected _dataIsLoad: boolean = false;

    protected _isSettingSprite: boolean = false;

    protected _currentTime: number = 0;

    protected _isLoading: boolean = false;

    public onLoad(): void {
        let url: string = "https://hffile.ttigd.cn/game-common/" + GameConfig.wxAppName + "/carouselButtonConfig.json";
        this.setConfigJsonData(url);
    }

    public hide(): void {
        if (this.node.active) {
            this.node.active = false;
            this.rotate.hide();
        }
    }

    protected setConfigJsonData(url: string): void {

        GameCommonHttp.wxHttpGet(url, (retCode: number, retData: any) => {
            if (retCode != 0 || retData == null || retData.moreConfig == null) {
                this.hide();
                return;
            }
            if (this.moreBtnType === CarouselButtonType.More) {
                this._configJsonData = retData.moreConfig;
            }

            if (this._configJsonData._jumpSwith) {
                this.node.active = true;
            } else {
                this.hide();
                return;
            }
            this._dataIsLoad = true;
            this.setSpriteUrlArr();
            this.setSprite();
        });
    }

    protected setSpriteUrlArr(): void {
        this._configJsonData.array.forEach(data => {
            this._spriteUrlArr.push(data._jumpImageUrl);
        });
    }

    protected setSprite(): void {
        if (!this.node.active || this._isSettingSprite) {
            return;
        }
        this._isSettingSprite = true;
        let self: CarouselButton = this;
        if (!this._dataIsLoad || this._spriteUrlArr.length === 0) {
            self.scheduleOnce(() => {
                self.setSprite();
            }, 5);
        } else {
            if (this._spriteArr.length === 0 || this._currentIndex > this._spriteArr.length - 1 || this._spriteArr[this._currentIndex] === null) {
                console.log("down load sprite");
                GameCommonUtil.getTextureByUrl(self._spriteUrlArr[this._currentIndex], (texture: cc.Texture2D) => {
                    if (texture == null) {
                        return;
                    }
                    self._isSettingSprite = false;
                    let spriteFrame: cc.SpriteFrame = new cc.SpriteFrame(texture);
                    if (spriteFrame != null) {
                        self.currentSpriteConfig.spriteFrame = spriteFrame;
                        self._spriteArr.push(spriteFrame);
                        self._spriteArr.sort();
                    }
                    console.log("more spriteFrame :" + spriteFrame);
                });
            } else {
                if (this._spriteArr[this._currentIndex] != null) {
                    this.currentSpriteConfig.spriteFrame = this._spriteArr[this._currentIndex];
                }
                this._isSettingSprite = false;
                console.log("is have down sprite");
            }
        }
    }

    protected click(): void {
        let jumpAppId: string = "";
        let jumpPath: string = "";
        let jumpName: string = "";
        let self: CarouselButton = this;
        if (self._configJsonData === null) {
            return;
        }
        if (this._configJsonData.array.length < this._currentIndex) {
            return;
        }
        jumpAppId = self._configJsonData.array[self._currentIndex]._jumpAppId;
        jumpPath = self._configJsonData.array[self._currentIndex]._jumpPath;
        jumpName = self._configJsonData.array[self._currentIndex]._name;
        var QRCode = self._configJsonData.array[self._currentIndex]._QRCode;
        var switchQRCode = self._configJsonData.array[self._currentIndex]._switchQRCode;

        if (!jumpAppId) {
            return;
        }
        self._currentTime = 0;
        StatisticsManager.uploadJumpRecord(jumpAppId, jumpName, "playerClick");
        window.gameCommon.getSDK.navigateToMiniProgram(jumpAppId, jumpPath, (success: boolean) => {
            self._currentIndex++;
            if (self._currentIndex >= self._spriteUrlArr.length) {
                self._currentIndex = 0;
            }
            self.setSprite();
            if (!success) {
                //跳转失败后判断是否需要二维码跳转
                if (switchQRCode) {
                    window.gameCommon.getSDK.previewImage(QRCode);
                }
                return;
            }
            StatisticsManager.uploadJumpRecord(jumpAppId, jumpName, "jumpSuccess");
        });
    }

    public update(dt: number): void {
        if (this.node.active && this._spriteUrlArr.length > 1) {
            this._currentTime += dt;
            if (this._currentTime >= this.switchTime) {
                this._currentIndex++;
                if (this._currentIndex >= this._spriteUrlArr.length) {
                    this._currentIndex = 0;
                }
                this.setSprite();
                this._currentTime = 0;
            }
        }
    }
}
