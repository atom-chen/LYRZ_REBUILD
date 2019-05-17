export class GameCommonUtil {

    //随机获取32位的uuid
    public static uuid(): string {

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

        var uuid = [], i;

        var radix = 16 || chars.length;

        for (i = 0; i < 32; i++) uuid[i] = chars[0 | Math.random() * radix];

        return uuid.join('');
    }

    public static getShotNumberStr(number: number): string {

        let show = "";

        if (number < 10000) {
            return show + number;
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "K";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "M";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "G";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "A";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "B";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "C";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "D";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "F";
        }

        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + "AA";
        }

        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + "BB";
        }

        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + "CC";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "DD";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "EE";
        }

        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + "FF";
        }
    }

    public static getLongNumberStr(number: number): string {

        let show = "";

        if (number < 1000) {
            return show + number;
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3);
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "K";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "K";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "M";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "M";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "G";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "G";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "A";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "A";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "B";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "B";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "C";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "C";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "D";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "D";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "E";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "E";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "F";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "F";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "AA";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "AA";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "BB";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "BB";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "CC";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "CC";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "DD";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "DD";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "EE";
        }

        if (number < 1000 * 1000) {
            return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "EE";
        }

        number = Math.floor(number / 1000);

        if (number < 1000) {
            return show + number + "FF";
        }

        return show + Math.floor(number / 1000) + "," + ('00' + number % 1000).slice(-3) + "FF";
    }

    public static getFloatNumberStr(number: number): string {

        let show = "";
        let floatStr = "."

        if (number < 10000) {
            return show + number;
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "K";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "M";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "G";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "A";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "B";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "C";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "D";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "F";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + floatStr + "AA";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + floatStr + "BB";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);
        if (number < 10000) {
            return show + number + floatStr + "CC";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "DD";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "EE";
        }

        floatStr = "." + (number % 1000);
        number = Math.floor(number / 1000);

        if (number < 10000) {
            return show + number + floatStr + "FF";
        }
    }

    public static isToday(time: number): boolean {
        console.log(new Date(time).toDateString());
        console.log(new Date().toDateString());
        if (new Date(time).toDateString() === new Date().toDateString()) {
            //今天
            return true
        }
        return false;
    }

    public static getTextureByUrl(url: string, callBack: (texture: cc.Texture2D) => void): void {

        if (url == null || callBack == null) {
            return;
        }

        cc.loader.load({ url: url, type: "png" }, function (error, texture) {

            callBack(texture);
        });
    }
}