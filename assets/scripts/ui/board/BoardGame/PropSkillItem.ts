import { PropData } from "../../../game/prop/PropData";
import { GameComponent } from "../../../common/GameComponent";
import { PropUseEnum } from "../../../game/prop/PropUseEnum";

/**
 * Created by 郭荣凯
 * Time: 2019/04/03.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class PropSkillItem extends cc.Component {

    @property({
        displayName: "道具技能图标",
        type: cc.Sprite
    })
    private icon: cc.Sprite = null;

    @property({
        displayName: "道具技能名",
        type: cc.Sprite
    })
    private nameSprite: cc.Sprite = null;

    @property({
        displayName: "道具CD遮罩",
        type: cc.Sprite
    })
    private cdMask: cc.Sprite = null;

    private mPropData: PropData = null;

    public get propData(): PropData {
        return this.mPropData;
    }

    private durationTimer: number = 0;

    public bindData(propData: PropData): void {
        if (!propData) {
            return;
        }
        this.mPropData = propData;
        this.icon.spriteFrame = propData.icon;
        this.nameSprite.spriteFrame = propData.namePicture;
        this.cdMask.spriteFrame = propData.icon;
        this.cdMask.fillRange = 0;
        this.durationTimer = 0;
    }

    public update(dt: number): void {
        if (!this.mPropData) {
            return;
        }
        if (this.durationTimer < this.mPropData.durationTime) {
            this.durationTimer += dt;
            this.cdMask.fillRange = this.durationTimer / this.mPropData.durationTime;
        } else {
            if (this.propData.propUseType === PropUseEnum.SOUL_BODY && playerController.propSoulBodyList.length > 0) {
                return;
            }
            this.mPropData = null;
            this.icon.spriteFrame = null;
            this.nameSprite.spriteFrame = null;
            this.cdMask.spriteFrame = null;
            this.durationTimer = 0;
        }
    }

    public clear(): void {
        this.mPropData = null;
        this.icon.spriteFrame = null;
        this.nameSprite.spriteFrame = null;
        this.cdMask.spriteFrame = null;
        this.cdMask.fillRange = 0;
    }
}
