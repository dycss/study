/**
 * sessionStorage存储模型mixin
 * created by donaldcen on 2015/11/26
 */
define(function (require, exports, module) {
    var _ = require('lib/underscore');
    var SS = function (opt) {
        this.opts = _.extend({}, opt);
        return this;
    };
    SS.prototype = {
        opts: {},
        expSuffix: '_exp',
        /**
         * 存储
         * @param {String} key 存入key
         * @param {Object | String} value 存入值
         * @param {Number} exp 到期时间
         */
        save: function (key, value, exp) {
            console.info('写入缓存',key, value);
            if (typeof value == 'object') {
                value = JSON.stringify(value);
            }
            exp = exp || Number(new Date()) + 24 * 60 * 60 * 1000; // 默认缓存一天
            if (window.sessionStorage) {

                window.sessionStorage[key] = value;
                if(this.check(key, value)){
                    //打上到期时间
                    exp && (window.sessionStorage[key + this.expSuffix] = Number(exp));
                    return true;
                }else{
                    //缓存失败，删除key内容
                    this.remove(key);
                    console.warn('缓存失败:'+key);
                    return false;
                }
            } else {
                console.error('window sessionStorage undefined!');
            }
            return this;
        },
        /**
         * 检查缓存是否正确
         * @param key
         * @param value
         */
        check: function(key, value){
            return window.sessionStorage.getItem(key) == value;
        },

        /**
         * 移出元素
         * @param key
         */
        remove: function (key) {
            if (window.sessionStorage) {
                window.sessionStorage.removeItem(key);
            }
        },
        /**
         * 读取
         * @param key
         * @returns {*}
         */
        read: function (key) {
            if (window.sessionStorage) {
                try {
                    var isable = (window.sessionStorage[key + this.expSuffix] && Number(window.sessionStorage[key + this.expSuffix]) > Number(new Date()));
                    if (isable) {
                        return JSON.parse(window.sessionStorage[key]);
                    } else {
                        return undefined;
                    }
                } catch (e) {
                    return undefined;
                }

            } else {
                console.error('window sessionStorage undefined!');
                return undefined;
            }
        }
    };
    module.exports = function (opt) {
        return {sessionStorage: new SS(opt)};
    };
    window.SS = new SS();
});