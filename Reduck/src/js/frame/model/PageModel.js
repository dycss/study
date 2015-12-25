/**
 * page 模型 -Backbone View
 * Create by donaldcen on 2015/11/6
 */
define(function (require, exports, module) {
    var lib = require('frame/lib');
    var _ = lib._;
    var Dispatcher = require('frame/dispatcher/Dispatcher');
    var report = require('business/report');
    var UNSUPPORTED = function () {
        // console.error('尚未实现，待具体业务实现')
    };
    var Page = function (obj) {
        _.extend(this, obj);
    };
    Page.prototype = {
        title: '',
        store: null,
        view: null,
        styleSheet: [],
        beforeInit: function () {
            var now = new Date();
            console.log('模块加载完成，耗时：', now - window._commonPoints['head']);
        },
        initialize: function (frame, params, container) {
            this.beforeInit(frame, params);

            this.id = params.module;
            //读取样式
            if (this.styleSheet) {
                frame.style.addStyles(this.styleSheet);
            }
            this.container = container;

            this.setTitle();
            //初始化Store
            this.initStore();
            this._listenActions(); //监听渲染
            this.init(frame, params);
            this.initView(frame, params, container);

            this.ready(frame, params);
            this.setShareButton(frame);

            this._isRender = true;
            window.Page = this;
        },
        /**
         * 设置标题
         */
        setTitle: function () {
            if (this.title) {
                document.title = this.title;
            }
        },

        //设置分享
        setShareButton: function (frame) {
            frame.setShareButton('', {title: '加入QQ公会，玩游戏不再孤单', desc: '有福利，有礼包，你还不来？'}, function (type, result) {
                report.collect({
                    webId: 520002,
                    opType: type,
                    classId: 6
                })
            });
        },
        init: function (frame, param) {
            if (!param.debug) {
                //TODO 移走
                require('util/requireAsyncRetry')(require, 'fastclick', function (FastClick) {
                    FastClick.attach(document.body);
                });
            }
        },
        initView: function (frame, params, container) {
            var onError = (typeof frame.showError == 'function') && frame.showError.bind(frame) || (function () {
                    console.error(arguments)
                });
            if (this.view) {
                var _isShow = false;
                this.viewModel = new this.view({
                    el: container, models: this.store, onError: onError, show: function () {
                        !_isShow && frame.ready && frame.ready();
                        _isShow = true;
                    }
                });
            }
        },
        extend: function (obj) {
            return _.extend(this, obj);
        },

        _listenActions: function () {
            this.dispatcherId = Dispatcher.register(this.listenActions);
        },
        _removeActions: function () {
            console.log('销毁调度器', this.dispatcherId);
            if (this.dispatcherId) {
                Dispatcher.unregister(this.dispatcherId);
                this.dispatcherId = null;
            }
            console.log(Dispatcher.$Dispatcher_callbacks);
        },
        /**
         * 注册dispatcher://TODO
         */
        listenActions: function () {
            //console.log('listen Actions');
            //Dispatcher.register
        },
        ready: function () {
            var now = new Date();
            console.log('渲染完成，耗时：', now - window._commonPoints['head']);
        },

        /**
         * 销毁前TODO
         */
        beforeDestroy: UNSUPPORTED,

        /**
         * 后退前回调TODO，return true正常后退逻辑，return false不继续后退。
         * @returns {boolean}
         */
        beforeBack: function(){
            return true;
        },

        /**
         * 初始化Store
         */
        initStore: function () {
            if (this.store) {
                for (var i in this.store) {
                    //console.log(this.store[i].id, this.store[i]._isInit)
                    if (typeof this.store[i].init == 'function') {
                        this.store[i].init();
                    }
                }
            }
        },
        /**
         * 重置store
         */
        resetStore: function () {
            if (this.store) {
                for (var i in this.store) {
                    console.log('重置', this.store[i].id);
                    if (typeof this.store[i].reset == 'function') {
                        this.store[i].reset();
                    }
                }
            }
        },
        /**
         * 摧毁page
         */
        destroy: function () {
            //销毁前的业务
            this.beforeDestroy();
            //移出调度器方法
            this._removeActions();
            //重置store model
            this.resetStore();
            //view自毁
            if (this.viewModel) {
                this.viewModel.destroy();
                this.viewModel = null;
            }
            console.log('销毁', this.title);
        }
    };
    module.exports = Page;

});