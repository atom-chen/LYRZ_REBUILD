export class GameCommonPool {

    //存放所有创建的实例
    private static pool: Set<cc.Node> = new Set();

    //存放可用的实例
    private static currentePool: Map<cc.Prefab, Array<cc.Node>> = new Map();

    //存放预设和实例之间的关系
    private static instantToPrefab: Map<cc.Node, cc.Prefab> = new Map();

    //存放url和预设之间的关系
    private static urlToPrefab: Map<string, cc.Prefab> = new Map();

    public static addUrlToPrefab(url: string, prefab: cc.Prefab): void {

        if (url == null || prefab == null) {
            return;
        }
        this.urlToPrefab.set(url, prefab);
    }

    public static addPrefabPool(prefab: cc.Prefab): void {

        if (this.currentePool.has(prefab)) {

            return;
        }

        var currentList: Array<cc.Node> = new Array();

        this.currentePool.set(prefab, currentList);
    }

    public static addAndPopInstant(prefab: cc.Prefab): cc.Node {

        var instant = cc.instantiate(prefab);

        if (instant == null) {
            return null;
        }

        this.pool.add(instant);

        this.instantToPrefab.set(instant, prefab);

        return instant;
    }

    public static requestInstantWithArgs(prefab: cc.Prefab, position: cc.Vec2, rotation: number, parent: cc.Node): cc.Node {

        this.addPrefabPool(prefab);

        var currentList = this.currentePool.get(prefab);

        if (currentList == null) {
            return null;
        }

        var instant = currentList.pop();

        if (instant == null) {
            instant = this.addAndPopInstant(prefab);
        }

        if (instant == null) {
            return null;
        }

        instant.rotation = rotation;
        instant.position = position;
        instant.active = true;
        instant.setParent(parent);

        return instant;
    }

    /**
     * 通过预设生成实例， 会优先从对象池中加载， 此方法同步返回实例
     * @param prefab 需要生成实例的预设
     */
    public static requestInstant(prefab: cc.Prefab): cc.Node {

        this.addPrefabPool(prefab);

        var currentList = this.currentePool.get(prefab);

        if (currentList == null) {
            return null;
        }

        var instant = currentList.pop();

        if (instant == null) {
            instant = this.addAndPopInstant(prefab);
        }

        if (instant == null) {
            return null;
        }

        instant.active = true;

        return instant;
    }

    /**
     * 通过url加载实例，会优先从对象池中加载， 此方法异步返回实例
     * @param url 对应预设放在resources文件下的路径url
     * @param callBack 生成预设后的回调
     */
    public static requestInstantByUrl(url: string, callBack: (err: any, ins: cc.Node) => void): void {

        if (url == null) {
            if (callBack != null) {
                callBack("null url", null);
            }
            return;
        }

        if (this.urlToPrefab.has(url)) {
            var prefab = this.urlToPrefab.get(url);
            var ins = this.requestInstant(prefab);
            if (callBack != null) {
                callBack(null, ins);
            }
            return;
        }

        cc.loader.loadRes(url, function (err, prefab) {
            GameCommonPool.addUrlToPrefab(url, prefab);
            var ins = GameCommonPool.requestInstant(prefab);
            if (callBack != null) {
                callBack(err, ins);
            }
        });
    }

    /**
     * 归还实例到对象池中
     * @param instant 需要归还的实例
     */
    public static returnInstant(instant: cc.Node): void {

        if (instant == null) {
            return;
        }

        if (!instant.isValid) {
            return;
        }

        instant.active = false;

        instant.removeFromParent();
        
        var prefab = this.instantToPrefab.get(instant);

        if (prefab == null) {
            return;
        }

        var currentList = this.currentePool.get(prefab);

        if (currentList == null || currentList.indexOf(instant) != -1) {
            return;
        }

        currentList.push(instant);
    }

    /**
     * 清空对象池
     */
    public static reset(): void {

        for (var instantList of Array.from(this.currentePool.values())) {
            for (var instant of instantList) {
                if (instant.isValid) {
                    instant.destroy();
                }
            }
        }

        this.pool.clear();

        this.currentePool.clear();

        this.instantToPrefab.clear();

        this.urlToPrefab.clear();
    }
}
