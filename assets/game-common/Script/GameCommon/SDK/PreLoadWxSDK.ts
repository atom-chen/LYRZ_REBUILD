import { ISDK } from "./ISDK";

const {ccclass, property} = cc._decorator;

@ccclass
export abstract class PreLoadWxSDK extends cc.Component {

    /**
     * 初始化分享到不同群的回调，使用sdk接口下的addShareToDiffSuccessCall方法初始化
     * @param wxSDK 
     */
    public abstract initShareToDiffSuccessCall(wxSDK: ISDK): void;
}