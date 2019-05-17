const { ccclass, property } = cc._decorator;
declare global {
    interface Window {
        subpackageMaxIndex: number;
    }
}

@ccclass
export class LoadSubpackage extends cc.Component {

    private _preloadedSubPackageLength: number = 0;
    private _preloadSubPackageLength: number = 0;

    private onProgress: (progress: number) => void = null;
    private onFailed: () => void = null;
    private onSuccess: () => void = null;

    public startLoad(onProgress: (progress: number) => void, onFailed?: () => void, onSuccess?: () => void) {

        if (!CC_WECHATGAME) {
            if (onSuccess) {
                onSuccess();
            }
            return;
        }

        this.onProgress = onProgress;
        this.onFailed = onFailed;
        this.onSuccess = onSuccess;

        let self = this;
        let loadMaxIndex = window.subpackageMaxIndex;
        this._preloadSubPackageLength = loadMaxIndex;
        this._preloadedSubPackageLength = 0;

        for (let i = 1; i <= loadMaxIndex; i++) {
            let s = i + "";

            wx.loadSubpackage({
                name: s,
                success: function (res) {
                    console.log("preloadSubPackageNeo suc " + s);
                    console.log(res);
                    self._preloadedSubPackageLength++;
                    if (self.node != null && self.node.isValid && self.onProgress != null) {
                        self.onProgress(self._preloadedSubPackageLength / self._preloadSubPackageLength);
                    }

                    if (self._preloadedSubPackageLength === self._preloadSubPackageLength) {
                        console.log("preloadSubPackageNeo done");
                        if (self.onSuccess) {
                            self.onSuccess();
                        }
                    }
                },
                fail: function (res) {
                    console.log("preloadSubPackageNeo fail");
                    console.log(res);
                    if (self.onFailed) {
                        self.onFailed();
                    }
                }
            });
        }
    }
}

