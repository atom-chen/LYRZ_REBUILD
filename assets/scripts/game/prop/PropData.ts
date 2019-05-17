import { PropUseEnum } from "./PropUseEnum";
import { RoleType } from "../role/RoleType";
import { ApplyType } from "../skill/ApplyType";

export class PropData {
    public id: number = 0;

    public propUseType: PropUseEnum = PropUseEnum.NONE;

    public targetType: RoleType = RoleType.Player;

    public durationTime: number = 0;

    public icon: cc.SpriteFrame = null;

    public namePicture: cc.SpriteFrame = null;

    public hp: number = 0;

    public valuePercent: number = 100;

    public count: number = 0;

    public applyType: ApplyType = ApplyType.None;
}