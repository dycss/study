/**
 * ModuleCtrl 模块生命周期控制器
 * @author donaldcen 20150830
 */
define(function (require, exports, module) {
    var Dispatcher = require('frame/dispatcher/Dispatcher');
    var RouterDB = require('frame/routerModel');
    var routerDB = new RouterDB();
    var ModuleCtrl = {
        /**
         * 读取Module
         * @param {string} md 模块
         * @param {string} ac 操作
         * @param {string} con 数据
         */
        loadModule: function (md, ac, con) {
            //console.log('router', md, ac, con);
            var me = this;
            var cj = {};
            //将数据自动转成对象
            if (con && con.indexOf(':') > -1) {
                con.replace(/(\w+)\s*:\s*([\w-]+)/g, function (a, b, c) {
                    b && (cj[b] = c);
                });
            } else {
                cj = con;
            }
            //console.log(cj);

            var moduleUrl = ['modules', md, ac].join('/'),
                exports;

            if (exports = this.getModuleByCache(moduleUrl)) {//获取本地缓存模块
                //通知事件总线
                me.dispatch("load", [null, exports, cj]);
            } else {
                //异步加载模块
                require.async(moduleUrl, function (exports) {
                    //console.log('异步', exports);
                    if (exports) {
                        me.saveModuleByCache(moduleUrl, exports);
                        //exports(cj);
                        //通知事件总线
                        me.dispatch("load", [null, exports, cj]);
                    } else {
                        me.dispatch("load", [moduleUrl + '模块加载失败']);
                        //console.error(moduleUrl,'加载失败');
                    }
                });
            }

        },

        /**
         * 缓存模块
         * @param {String} moduleUrl 模块ID，短地址
         * @param {Function} modules 入口模块内容
         */
        saveModuleByCache: function (moduleUrl, modules) {
            return routerDB.set(moduleUrl, modules);
        },

        /**
         * 删除模块缓存
         * @param {String} moduleUrl 模块地址
         */
        removeModuleByCache: function (moduleUrl) {
            return routerDB.unset(moduleUrl);
        },

        /**
         * 获取缓存的Module
         * @param {Stringf} moduleUrl 模块ID
         */
        getModuleByCache: function (moduleUrl) {
            if (moduleUrl) {
                return routerDB.get(moduleUrl);
            } else {
                return routerDB;
            }
        },

        /**
         * 获取样式表
         * @param {String} styleUrl 模块路径
         * @param {Function} callback 加载回调函数 callback(err, data);
         */
        getStyleSheet: function (styleUrl, callback) {
            var me = this;
            styleUrl = 'modules/hall/style/hall.style.js';
            callback = callback || (function () {
            });
            require.async(styleUrl, function (exports) {
                if (exports) {
                    callback.call(me, null, exports);
                } else {
                    callback.call(me, styleUrl + '加载失败');
                }
            });
            return this;
        },

        /**
         * 样式加前缀
         * @param {String} topId 作用域父domID
         * @param {String} cssString 加载到的样式表
         */
        filterStyleSheet: function (topId, cssString) {
            cssString = (cssString || '').replace(/([^,{}]+)(\s*[{,])/g, function ($1) {
                var selecter = $1.replace(/^\s*/,'');
                if(selecter != ',' || selecter != '{'){//去除无效样式代码
                    return '#' + topId + ' ' + selecter;
                }else{
                    return $1;
                }

            });
            return cssString;
        },

        /**
         * 插入样式表
         */
        insertStyleSheet: function (id, styles) {
            var style = document.createElement('style');
            style.id = id;
            style.innerHTML = styles;
            document.head.appendChild(style);
            return this;
        },

        /**
         * 删除样式表
         */
        removeStyleSheet: function (id) {
            document.getElementById(id).remove();
            return this;
        },


        /**
         * 通知事件总线调度器
         * @param {String} actionId 操作id
         * @param {Array} params 通知参数
         */
        dispatch: function (actionId, params) {
            if (!actionId) return null;
            Dispatcher.dispatch({moduleId: "router", actionId: actionId, params: params});
        }
    };
    module.exports = ModuleCtrl;

});