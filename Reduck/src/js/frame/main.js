/**
 * 框架
 * created by donaldcen on 2015/11/9
 */
define(function (require, exports, module) {
    var uri = require('util/uri'),
        Dispatcher = require('frame/dispatcher/Dispatcher');

    var Router = require('frame/router'),
        frameDispatcher = require('frame/frameDispatcher'),
        Style = require('frame/loadStyle'),
        pageCut = require('frame/pageCut'),
        undefined;
    var UNSUPPORTED = function () {
        /* console.error('尚未实现，待具体业务实现')*/
    };


    /**
     * 框架
     * @constructor
     */
    function Frame(config) {
        this.userconfig = config || {};
        this._params = {};
        this._uri = {};
        this.getParams();
        this.debug();
        this.initRouter();
        this.load(true);
        this.initStore();

    }

    Frame.prototype = {
        dispatcher: frameDispatcher,
        style: Style,
        module: null,
        container: '#container',
        /**
         * 获取URL参数
         */
        getParams: function () {
            this._uri = uri.parseUrl(location.href);
            this._params = uri.parseQueryString(location.search);
            this._params.module = this._params.module || this.userconfig.normalModule || 'home';
        },

        debug: function () {
            var me = this;
            //debug环境
            if (typeof this._params.debug == 'undefined' && window.location.href.indexOf('/src/') < 0) {
                window.console = window.console || {};
                window.console.log = function () {
                };
                window.console.debug = function () {
                };
                window.console.info = function () {
                };
            } else {
                console.info('开启debug模式');
                this.__debugLoaded = true;
                var testDom = document.createElement('button');
                testDom.id = 'devClearCache';
                testDom.innerText = '测';
                testDom.onclick = function () {
                    me.clearStorage();
                };
                var style = {
                    position: 'fixed',
                    top: '40px',
                    left: '5px',
                    color: 'white',
                    opacity: .6,
                    backgroundColor: '#f60',
                    borderRadius: '5px',
                    padding: '5px 10px',
                    'z-index': 999
                };
                Object.keys(style).forEach(function (key) {
                    testDom.style[key] = style[key];
                });
                document.body.appendChild(testDom);
            }
        },
        clearStorage: function () {
            console.log('clear all localStorage');
            Object.keys(localStorage).forEach(function (key) {
                localStorage.removeItem(key);
            });
            window.localStorage && (window.localStorage.clear());
            window.sessionStorage && (window.sessionStorage.clear());
        },
        /**
         * 初始化路由
         */
        initRouter: function () {
            this._router = new Router({
                //页面history切换时运行load
                popstate: this.load.bind(this)
            });
            window.Router = this._router;
        },
        /**
         * 跳转模块
         * @param {String} moduleId
         * @param {Object} params
         */
        goModule: function (moduleId, params) {
            this._router.set({y: window.scrollY});
            this._router.go(moduleId, '', params);
            //this.showLoading && this.showLoading(); //不需要每次都loading
            this.load();
        },

        /**
         * 后退调用
         */
        back: function () {
            if(typeof this.module.beforeBack == 'function' && !this.module.beforeBack()){
                return true;
            }
            console.log('back', this._router.getPageIndex());
            if (this._router.getPageIndex()) {
                this._router.back();
                //返回true禁止mqq后退；
                return true;
            } else {
                //已经退到底了
                return false;
            }
        },

        /**
         * 拉取模块
         */
        load: function (reload) {
            var moduleId = this._params.module;
            //重置加载时间
            window._commonPoints = {head: Date.now()};
            this.getParams();
            /*onpopstate会被手Q调用，因此需要判断*/
            if (reload || (moduleId != this._params.module)) {
                //var oldDom = this.pageCut();
                this.destroyModule();
                //删除旧元素
                //(oldDom) && (oldDom.parentNode.removeChild(oldDom));
                this.loadScript(this.loadModule);
            }
        },

        initStore: function () {
            var me = this;
            Dispatcher.register(function (payload) {
                console.log('调度器', payload);
                var actionId = payload['actionId'];
                if (payload['moduleId'] == 'base' || payload['moduleId'] == 'frame') {
                    //console.log(payload)
                    if (typeof me[actionId] == 'function') {
                        me[actionId].apply(me, payload['params']);
                    }
                }
            });
            window.Dispatcher = Dispatcher;
        },

        ready: function () {
            var me = this;
            //回到页面滚动到上次离开的位置
            var y = this._router.get().y || 0;
            setTimeout(function () {
                window.scrollTo(0, y);
            }, 0);
            me.hideLoading();
        },


        /**
         * 拉取模块
         */
        loadModule: function (callback) {
            callback = callback || (function () {
                });
            var me = this;
            //默认走home
            var enter = this._params.module || 'home';
            var moduleUrl = 'page/' + enter + '/index';
            if (enter) {
                seajs.use(moduleUrl, function (page) {
                    console.log('加载', moduleUrl);
                    if (page && typeof page.initialize == 'function') {
                        me.page = page;
                        //console.log(module);
                        //TODO container
                        page.initialize(me, me._params, document.getElementById('container'));
                    } else {
                        console.error(moduleUrl, '加载失败');
                        me.showError('模块参数无效[' + moduleUrl + ']', false);
                    }
                });
            }
        },


        /**
         * 销毁模块
         */
        destroyModule: function (page) {
            var module = page || this.page;
            console.log('销毁模块', module);
            if (module) {
                //执行模块自身的回收
                if (typeof module.destroy == 'function') {
                    module.destroy();
                }
                this.module = null;
            }
        },
        /**
         * 过滤pageMap
         */
        filterPageMap: function (id) {
            var map = window.pageMap || {};
            var urls = [];
            if (map['common']) {
                map['common'].forEach(function (item) {
                    urls.push(item.replace(/\{([^}]*)\}/g, id || ''));
                });
            }
            if (map[id]) {
                map[id].forEach(function (item) {
                    urls.push(item.replace(/\{([^}]*)\}/g, id || ''));
                });
            }
            return urls;
        },

        /**
         * 拉取page需要的js
         */
        loadScript: function (callback) {
            var me = this;
            callback = callback || (function () {
                });
            if (typeof window.loadScript == 'function') {
                if (window.pageMap) {
                    window.loadScript(this.filterPageMap(this._params.module), function (err) {
                        if (err) {
                            me.showError('脚本加载失败,请点击刷新');
                        } else {
                            callback.call(me);
                        }
                    });
                } else {
                    callback.call(this);
                }
            } else {
                // 测试环境没有loadScript
                callback.call(this);
            }
        },

        /**
         * 刷新当前page
         */
        reload: function () {
            this.load(true);
        },


    };


    module.exports = Frame;

});