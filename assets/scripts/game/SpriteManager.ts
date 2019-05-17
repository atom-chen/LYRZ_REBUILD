/**
 * Created by 郭荣凯
 * Time: 2019/04/03.
 */
const { ccclass, property } = cc._decorator;

@ccclass
export class SpriteManager extends cc.Component {

    @property({
        displayName: "道具图标列表",
        type: [cc.SpriteFrame]
    })
    private propIconArray: Array<cc.SpriteFrame> = new Array();

    @property({
        displayName: "道具名字图片列表",
        type: [cc.SpriteFrame]
    })
    private propNameArray: Array<cc.SpriteFrame> = new Array();

    @property({
        displayName: "武器图标列表",
        type: [cc.SpriteFrame]
    })
    private weaponIconArray: Array<cc.SpriteFrame> = new Array();

    @property({
        displayName: "技能图标列表",
        type: [cc.SpriteFrame]
    })
    private skillIconArray: Array<cc.SpriteFrame> = new Array();

    /**
     * 通过道具ID获取道具图标
     * @param id 
     */
    public getPropIconByID(id: number): cc.SpriteFrame {
        for (const icon of this.propIconArray) {
            if (icon.name === "icon_propSkill" + id) {
                return icon;
            }
        }
        console.warn("道具id错误:" + id);
        return null;
    }

    /**
     * 通过道具ID获取道具名字图标
     * @param id 
     */
    public getPropNameByID(id: number): cc.SpriteFrame {
        for (const nameSprite of this.propNameArray) {
            if (nameSprite.name === "image_propName" + id) {
                return nameSprite;
            }
        }
        console.warn("道具id错误:" + id);
        return null;
    }

    /**
     * 通过武器ID获取武器图标
     * @param id 
     */
    public getWeaponIconByID(id: number): cc.SpriteFrame {
        for (const icon of this.weaponIconArray) {
            if (icon.name === id + "") {
                return icon;
            }
        }
        console.warn("武器id错误:" + id);
        return null;
    }

    /**
     * 通过技能ID获取技能图标
     * @param id 
     */
    public getSkillIconByID(id: number): cc.SpriteFrame {
        for (const icon of this.skillIconArray) {
            if (icon.name === id + "") {
                return icon;
            }
        }
        console.warn("技能id错误:" + id);
        return null;
    }
}
