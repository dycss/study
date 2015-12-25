(function (window) {
    /**
     * 拉取js
     * @param {String} url
     * @param {Function} callback 回调
     */
    function getScript(url, callback) {
        var head = document.getElementsByTagName('head')[0],
            js = document.createElement('script');

        js.src = url;
        js.async = 'async';

        head.appendChild(js);

        js.onload = function () {
            js.onerror = js.onabort = js.onload = null;
            callback(null, url);
        };
        js.onerror = js.onabort = function () {
            js.onerror = js.onabort = js.onload = null;
            js.parentNode.removeChild(js);
            callback('ERROR:', url);
        };
    }

    var cache = {};

    function saveCache(url) {
        (!cache[url]) && (cache[url] = {});
        cache[url].url = url;
    }

    /**
     * 拉取多个script
     * @param list
     * @param callback
     */
    function loadScriptList(list, callback) {
        if (typeof list == 'string') {
            list = [list];
        }
        var len = list.length;
        var errorUrl = [];
        var cb = function (err, url) {
            if (err) {
                errorUrl.push(url);
            }else{
                saveCache(url);
            }
            len--;
            if (len <= 0) {
                (errorUrl.length == 0) && (errorUrl = null);
                console.log('拉取完成，错误：', JSON.stringify(errorUrl));
                callback(errorUrl);
            }
        };
        //没长度不需要拉取
        if (!len) {
            cb(null);
            return false;
        }
        console.log('拉取script', list);
        list.forEach(function (item) {
            if(!cache.item){
                getScript(item, function (err, url) {
                    if (err) {//出错重试
                        getScript(url, cb);
                    } else {
                        cb(null, url);
                    }
                });
            }
        });
    }

    function loadScriptByCDN(list, callback) {

    }

    window.loadScript = loadScriptList;
})(window);