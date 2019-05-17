export class GameCommonHttp {
    /**
     * @deprecated 此方法已废弃，不建议再使用
     */
    public static httpGets(url: string, httpCallback: (retCode: number, response: string) => void): void {

        url = encodeURI(url);

        var result = false;
        try {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    if (result) {
                        return;
                    }
                    result = true;
                    var response = xhr.responseText;
                    if (httpCallback != null) {
                        httpCallback(0, response);
                    }
                    console.log("httpGet succ");
                }
            };

            xhr.open("GET", url, true);
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
            xhr.timeout = 5000;
            xhr.send();
        } catch (error) {
            if (result) {
                return;
            }
            result = true;
            console.log("httpPost fail:" + error);
            if (httpCallback != null) {
                httpCallback(1, null);
            }
        }

        setTimeout(() => {
            if (result) {
                return;
            }
            result = true;
            if (httpCallback != null) {
                httpCallback(-1, null);
            }
        }, 5000);
    }

    /**
     * @deprecated 此方法已废弃，不建议再使用
     */
    public static httpPost(url: string, dataStr: string, httpCallback: (retCode: number, response: string) => void): void {

        url = encodeURI(url);

        var result = false;
        try {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                    if (result) {
                        return;
                    }
                    result = true;
                    var response = xhr.responseText;
                    if (httpCallback != null) {
                        httpCallback(0, response);
                    }
                    console.log("httpPost succ:" + this.response);
                }
            };

            xhr.open("POST", url, true);
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
            }
            xhr.setRequestHeader("Content-Type","application/json");
            xhr.timeout = 5000;
            xhr.send(dataStr);
        } catch (error) {
            if (result) {
                return;
            }
            result = true;
            console.log("httpPost fail:" + error);
            if (httpCallback != null) {
                httpCallback(1, null);
            }
        }

        setTimeout(() => {
            if (result) {
                return;
            }
            result = true;
            if (httpCallback != null) {
                httpCallback(-1, null);
            }
        }, 5000);
    }

    public static wxHttpGet(url: string, httpCallback: (retCode: number, retData: any) => void): void {
        
        if (url == null) {
            return;
        }

        if (url.indexOf("mcachenum") == -1) {
            if (url.indexOf("?") > -1) {
                url += "&mcachenum=" + Date.now();
            } else {
                url += "?mcachenum=" + Date.now();
            }
        }
        console.log(url);

        if (!CC_WECHATGAME) {
            this.httpGets(url, (retCode: number, response: string): void => {
                if (httpCallback) {
                    httpCallback(retCode, response && JSON.parse(response));
                }
            });
            return;
        }

        wx.request({
            url: url,
            success(res) {
                console.log(res);
                if (httpCallback) {
                    httpCallback(0, res.data);
                }
            },
            fail(res) {
                console.error(res);
                if (httpCallback) {
                    httpCallback(-1, null);
                }
            }
        });
    }

    public static wxHttpPost(url: string, data: object, httpCallback: (retCode: number, retData: any) => void): void {
        
        if (!CC_WECHATGAME || url == null) {
            return;
        }

        if (url.indexOf("mcachenum") == -1) {
            if (url.indexOf("?") > -1) {
                url += "&mcachenum=" + Date.now();
            } else {
                url += "?mcachenum=" + Date.now();
            }
        }

        console.log(url, data);

        if (!CC_WECHATGAME) {
            this.httpPost(url, data && JSON.stringify(data), (retCode: number, response: string): void => {
                if (httpCallback) {
                    httpCallback(retCode, response && JSON.parse(response));
                }
            });
            return;
        }

        wx.request({
            url: url,
            data: data,
            method: "POST",
            header: {
                'content-type': 'application/json',// 默认值
                "charset": "utf-8"
            },
            success(res) {
                console.log(res);
                if (httpCallback) {
                    httpCallback(0, res.data);
                }
            },
            fail(res) {
                console.error(res);
                if (httpCallback) {
                    httpCallback(-1, null);
                }
            }
        });
    }
}
