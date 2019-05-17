import { LoadSubpackage } from "./LoadSubpackage";
import { UserData } from "../../game-common/Script/GameCommon/UserData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(LoadSubpackage)
    private loader: LoadSubpackage = null;
    @property(cc.Label)
    private loadingTip: cc.Label = null;

    private subPackageLoaded: boolean = false;
    private gameStart: boolean = false;
    private timeCount: number = 0;
    private curPointNum: number = 0;

    public onLoad(): void {
        cc.director.preloadScene("main");
    }

    public start(): void {
        let self = this;
        this.loader.startLoad((progress) => { console.log(progress) }, null, () => {
            self.subPackageLoaded = true;
        });
    }

    public update(dt): void {
        if (this.subPackageLoaded && UserData.init && !this.gameStart) {
            this.gameStart = true;
            cc.director.loadScene("main");
        }
        this.timeCount += dt;
        if (this.timeCount >= 0.5) {
            this.timeCount = 0;
            this.curPointNum++;
            if (this.curPointNum > 3) {
                this.curPointNum = 0;
            }
            let pointString = "";
            for (let i = 0; i < this.curPointNum; i++) {
                pointString += ".";
            }
            this.loadingTip.string = "加载中" + pointString;
        }
    }
}
