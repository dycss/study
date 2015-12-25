/**
 * 框架-router模块
 * created by donaldcen on 2015/12/4
 */
define(function (require, exports, module) {
    function Router(config) {
        this._stateList = [];
        this.init(config);
    }

    Router.prototype = {
        init: function (config) {
            this.listenEvent();
            this.userConfig = config;
            this._stateList.push({
                state: {module: ''/*id*/, params: {}/*params*/, index: this._stateList.length},
                title: document.title,
                url: location.href
            });
        },
        listenEvent: function () {
            var me = this;
            //手Q初始化时会调用
            window.onpopstate = function (e) {
                var index = window.history.state && window.history.state.index;
                //如果后退把当前的状态删除
                if(index && me._stateList.length && index < me._stateList.length){
                    me._stateList.pop();
                }
                if (me.userConfig && typeof me.userConfig.popstate == 'function') {
                    me.userConfig.popstate();
                }
            };
        },
        getUrl: function (url, module, params) {
            var _url = (url.split('?') || [])[0];
            var _params = '';
            if (_url) {
                (function (obj) {
                    for (var key in obj) {
                        _params += key + '=' + obj[key] + '&';
                    }
                })(params);
                return _url + '?module=' + module + '&' + _params;
            } else {
                return false;
            }
        },
        /**
         * 设置当前路由状态
         * @param obj
         */
        set: function(obj, index){
            var me = this;
            if(!index){
                index = window.history.state && window.history.state.index || 0;
            }
            Object.keys(obj).forEach(function(key){
                !me._stateList[index] && (me._stateList[index] = {});
                me._stateList[index][key] = obj[key];
            });
        },
        get: function(index){
            if(!index){
                index = window.history.state && window.history.state.index || 0;
            }
            return this._stateList[index] || {};
        },
        go: function (id, title, params) {
            var url = this.getUrl(location.href, id, params);
            if (url) {
                var sts = {
                    state: {module: id, params: params, index: this._stateList.length},
                    title: title,
                    url: url
                };
                this._stateList.push(sts);
                window.history.pushState(sts.state, sts.title, sts.url);
            } else {
                console.error('router go url Error', id, params);
            }

        },
        _back: function () {
            return this._stateList.pop();
        },
        getPageIndex: function(){
            return window.history.state && window.history.state.index || 0;
        },
        /**
         * 后退，history中有数据就后退，没有就到底了
         * @returns {boolean}
         */
        back: function () {
            window.history.back();
        }
    };


    module.exports = Router;

});