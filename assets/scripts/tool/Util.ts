export class Util {

    public static integerRandomRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    public static randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static now(): number {
        return Date.now() * 0.001;
    }

    public static getWorldPosition(node: cc.Node): cc.Vec2 {
        if (node == null) {
            return null;
        }

        return node.convertToWorldSpaceAR(cc.v2(0, 0));
    }

    public static getWorldRotation(node: cc.Node): number {
        if (node == null) {
            return 0;
        }
        var rotation = node.rotation;
        while (node.getParent()) {
            rotation += node.getParent().rotation;
            node = node.getParent();
        }
        return rotation;
    }

    public static setWorldPosition(node: cc.Node, worldPos: cc.Vec2): void {
        if (!node) {
            return;
        }

        if (!worldPos) {
            return;
        }

        let parent = node.getParent();
        if (!parent) {
            node.position = worldPos;
            return;
        }

        let localPos = parent.convertToNodeSpaceAR(worldPos);
        node.setPosition(localPos);
    }

    public static _degreesToVector(degree: number) {
        let radian = this._getRadian(degree);    // 将角度转换为弧度
        let comVec = cc.v2(0, 1);    // 一个水平向右的对比向量
        let dirVec = comVec.rotate(-radian);    // 将对比向量旋转给定的弧度返回一个新的向量
        return dirVec;
    }

    /*角度/弧度转换
      角度 = 弧度 * 180 / Math.PI
      弧度 = 角度 * Math.PI / 180*/
    //根据角度计算弧度并返回
    public static _getRadian(angle: number): number {
        return Math.PI / 180 * angle;
    }

    //计算角度并返回
    public static _angle(point: cc.Vec2, pos: cc.Vec2): number {
        if (point == null || pos == null) {
            return 0;
        }
        return Math.atan2(point.y - pos.y, point.x - pos.x) * (180 / Math.PI);
    }

    public static _getAngle(radian: number): number {
        return (radian * 180) / Math.PI;
    }

    public static _getAngle0To180(l: cc.Vec2, r: cc.Vec2): number {
        var radian = Math.acos(this._dot(l, r));
        var angle = this._getAngle(radian);
        return angle;
    }

    //计算方向
    public static _fromAToB(a: cc.Vec2, b: cc.Vec2): cc.Vec2 {
        if (a == null || b == null) {
            return null;
        }
        return new cc.Vec2(a.x - b.x, a.y - b.y).normalizeSelf();
    }

    /* 计算向量与Y的弧度 */
    public static _angleToY(a: cc.Vec2) {
        if (a == null) {
            return 0;
        }
        var cosB = a.y;
        var angle = Math.acos(cosB);
        return angle * (a.x < 0 ? 1 : -1);
    }

    /* 点在相对坐标系发生偏移 */
    public static _offset(offsetX: number, offsetY: number, position: cc.Vec2, direction: cc.Vec2): cc.Vec2 {

        if (direction == null || position == null) {
            return null;
        }

        var x = offsetX * direction.y + direction.x * offsetY + position.x;
        var y = -direction.x * offsetX + direction.y * offsetY + position.y;

        return cc.v2(x, y);
    }

    /* 向量旋转角度 顺时针旋转 */
    public static _rotateAngle(a: cc.Vec2, angle: number): cc.Vec2 {

        if (a == null) {
            return null;
        }

        var radian = this._getRadian(angle);
        var sinB = Math.sin(radian);
        var cosB = Math.cos(radian);
        var rotateX = a.x * cosB + a.y * sinB;
        var rotateY = -a.x * sinB + a.y * cosB;

        return cc.v2(rotateX, rotateY);
    }

    public static _directionToRotation(direction: cc.Vec2): number {

        if (direction == null) {
            return 0;
        }

        return -(this.pToAngle(direction) / Math.PI * 180) + 90;
    }

    public static _cross(a: cc.Vec2, b: cc.Vec2): number {

        if (a == null || b == null) {
            return 0;
        }

        return a.x * b.y - a.y * b.x;
    }

    /* 计算向量的点乘 */
    public static _dot(a: cc.Vec2, b: cc.Vec2): number {

        if (a == null || b == null) {
            return 0;
        }

        return a.x * b.x + a.y * b.y;
    }

    //计算两点间的距离并返回
    public static _getDistance(pos1: cc.Vec2, pos2: cc.Vec2): number {

        if (pos1 == null || pos2 == null) {
            return 0;
        }

        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2));
    }

    public static clampVec2(pos: cc.Vec2, min: cc.Vec2, max: cc.Vec2): cc.Vec2 {

        if (pos == null || min == null || max == null) {
            return pos;
        }

        if (pos.x < min.x) {
            pos.x = min.x;
        } else if (pos.x > max.x) {
            pos.x = max.x;
        }

        if (pos.y < min.y) {
            pos.y = min.y;
        } else if (pos.y > max.y) {
            pos.y = max.y;
        }

        return pos;
    }
    public static pDistanceSQ(a: cc.Vec2, b: cc.Vec2): number {
        return this.pLengthSQ(a.sub(b));
    }

    public static pLengthSQ(a: cc.Vec2): number {
        if (a == null) {
            return 0;
        }
        return a.y * a.y + a.x * a.x;
    }

    public static pToAngle(v: cc.Vec2): number {
        if (v == null) {
            return 0;
        }
        return Math.atan2(v.y, v.x);
    }

    public static pDistance(a: cc.Vec2, b: cc.Vec2): number {
        return Math.sqrt(this.pDistanceSQ(a, b));
    }

    public static pSub(v1: cc.Vec2, v2: cc.Vec2): cc.Vec2 {
        if (v1 == null || v2 == null) {
            return null;
        }
        return cc.v2(v1.x - v2.x, v1.y - v2.y);
    }

    public static pAdd(v1: cc.Vec2, v2: cc.Vec2): cc.Vec2 {
        if (v1 == null || v2 == null) {
            return null;
        }
        return cc.v2(v1.x + v2.x, v1.y + v2.y);
    }

    public static randomMinus1To1(): number {
        return (Math.random() - 0.5) * 2;
    }

    public static pLerp(a: cc.Vec2, b: cc.Vec2, alpha: number): cc.Vec2 {
        return this.pAdd(this.pMult(a, 1 - alpha), this.pMult(b, alpha));
    }

    public static pMult(point: cc.Vec2, floatVar: number): cc.Vec2 {
        if (point == null) {
            return null;
        }
        return cc.v2(point.x * floatVar, point.y * floatVar);
    }

    public static pCross(v1: cc.Vec2, v2: cc.Vec2): number {
        if (v1 == null || v2 == null) {
            return 0;
        }
        return v1.x * v2.y - v1.y * v2.x;
    }

    public static pRPerp(point: cc.Vec2): cc.Vec2 {
        if (point == null) {
            return null;
        }
        return cc.v2(point.y, -point.x);
    }

    public static pPerp(point: cc.Vec2): cc.Vec2 {
        if (point == null) {
            return null;
        }
        return cc.v2(-point.y, point.x);
    }

    public static pProject(v1: cc.Vec2, v2: cc.Vec2): cc.Vec2 {
        return this.pMult(v2, this.pDot(v1, v2) / this.pDot(v2, v2));
    }

    public static pDot(v1: cc.Vec2, v2: cc.Vec2): number {
        if (v1 == null || v2 == null) {
            return 0;
        }
        return v1.x * v2.x + v1.y * v2.y;
    }

    public static movePosition(frontierOffset: cc.Node, position: cc.Vec2, offsetX: number, offsetY: number): cc.Vec2 {
        position.x += offsetX;
        position.y += offsetY;
        if (position.x < nodeManager.validRect.xMin) {
            position.x = nodeManager.validRect.xMin;
        }
        if (position.x > nodeManager.validRect.xMax) {
            position.x = nodeManager.validRect.xMax;
        }
        if (position.y < nodeManager.validRect.yMin) {
            position.y = nodeManager.validRect.yMin;
        }
        if (position.y > nodeManager.validRect.yMax) {
            position.y = nodeManager.validRect.yMax;
        }
        return position;
    }

    public static getQuadrantRandomPosition(rangeNode: cc.Node, quadrant: number, spawnMargin: number): cc.Vec2 {
        let randCoefficientX: number = 0;
        let randCoefficientY: number = 0;
        switch (quadrant) {
            case 1:
                randCoefficientX = Math.random();
                randCoefficientY = Math.random();
                break;
            case 2:
                randCoefficientX = -Math.random();
                randCoefficientY = Math.random();
                break;
            case 3:
                randCoefficientX = -Math.random();
                randCoefficientY = -Math.random();
                break;
            case 4:
                randCoefficientX = Math.random();
                randCoefficientY = -Math.random();
                break;
            default:
                break;
        }
        var randX = randCoefficientX * (rangeNode.width - spawnMargin) / 2;
        var randY = randCoefficientY * (rangeNode.height - spawnMargin) / 2;
        return cc.v2(randX, randY);
    }

    public static getSelfQuadrant(selfNode: cc.Node, worldPosition: cc.Vec2): number {
        let position: cc.Vec2 = selfNode.convertToNodeSpaceAR(worldPosition);
        if (position.x > 0 && position.y > 0) {
            return 1;
        }
        if (position.x <= 0 && position.y > 0) {
            return 2;
        }
        if (position.x <= 0 && position.y <= 0) {
            return 3;
        }
        if (position.x > 0 && position.y <= 0) {
            return 4;
        }
    }

    public static easing(time: number): number {
        return time === 1 ? 1 : (-(Math.pow(2, -10 * time)) + 1);
    }

    /**
     * 解析静态数据字符串
     * @param data 
     */
    public static parseStaticDataString(data: string): Array<Array<[number, number]>> {
        let list: Array<Array<[number, number]>> = new Array();
        let allDataList: string[] = data.split('|');
        for (let index = 0; index < allDataList.length; index++) {
            const itemsString = allDataList[index];
            let itemInfos: string[] = itemsString.split(";");
            let itemList: Array<[number, number]> = new Array();
            if (itemsString !== "0") {
                for (const enemy of itemInfos) {
                    let data: string[] = enemy.split(",");
                    itemList.push([Number(data[0]), Number(data[1])]);
                }
            }
            list.push(itemList);
        }
        return list;
    }

    public static insertString(soure: string, start: number, newStr: string): string {
        return soure.slice(0, start) + newStr + soure.slice(start);
    }
}