/**
 * dataModel 数据模型
 * Create by donaldcen on 2015/11/6
 */
define(function (require, exports, module) {
    var lib = require('frame/lib');
    var Backbone = lib.Backbone;
    var _ = lib._;
    var Data = require('business/data');
    var cgiConfig = require('business/cgiConfig');
    var unifyJson = require('util/unifyJson');

    var UNSUPPORTED = function () {
        /* console.error('尚未实现，待具体业务实现')*/
    };

    //重写Backbone发起请求的接口
    Backbone.sync = function (method, model, options) {
        //fetch，save等都会调用
        //console.log(method, model.get('params'), options);
        var data;
        var params = model.get('params');
        var page = model.page;
        //有分页混入分页参数
        if (page) {
            params = page.mixinParam(params);
        }
        //从session缓存读
        data = model.readFromSession(params);
        if (data) {
            /*读到数据*/
            console.log('从缓存读：', model.cgiId, params, data);
            model.saveData(model.processData(null, data));
        } else {
            /*没有缓存*/
            model.request(params, options, function (err, data, params, key) {
                if (!err) {
                    model.saveToSession(data, key);
                }
                var pData = model.processData(err, data);
                model.saveData(pData);
            });
        }
    };

    var DataModel = Backbone.Model.extend({
        initialize: function () {
            //console.log('init', this.id, this._isInit);
            if (!this._isInit) {
                if (this.cgiId && !this.cgiConfig && cgiConfig[this.cgiId]) {
                    this.cgiConfig = cgiConfig[this.cgiId];
                }
                //不需要拉取格式化数据
                //if (this.defaultData) {
                //    //this.set('data', this.defaultData);
                //    this.set('data', this.defaultData);
                //}
                this.task('init');
            }
            this._isInit = true;
            this._step = 'initialize';
        },
        task: function (taskId) {
            this._step = taskId;
            if (typeof this[taskId] == 'function') {
                this[taskId]();
            }
        },

        /**
         * 获取目前执行到的步骤
         * @returns {string|*}
         */
        getStep: function () {
            return this._step;
        },

        /**
         * 初始化
         */
        init: function init() {
            if (!this._isInit) {
                this._isInit = true;
                this.set({state: 'init'});
                this.afterInit();
            }
        },

        /**
         * 重置初始化
         */
        reset: function () {
            this.beforeReset();
            this._isInit = false;
        },

        /**
         * 发送请求
         * @param {Object} params 请求参数
         * @param {Object} options 选项会带回到parse中
         */
        request: function (params, options, callback) {
            callback = callback || (function () {
                });
            var _params = params;
            var key;
            var me = this;
            //校验请求状态
            try {
                key = JSON.stringify(_params);
                if (this.get('state') == 'request' && this.get('paramsKey') == key) {
                    console.warn('请求过快', _params);
                    return false;
                }
                this.set({state: 'request', paramsKey: key});
            } catch (e) {
                console.error('JSON.stringify', _params, e.message);
            }


            return Data.getCGI(me.cgiConfig, params, function (err, data) {
                me.set({state: 'response'});
                if (err) {
                    me.error(err, params, options.error);
                }
                callback(err, data, params, key);
            });
        },

        /**
         * 数据处理
         * @param {Object | String} err 错误
         * @param {Object} data 数据
         */
        processData: function (err, data) {
            var me = this;
            var _data = data || {};
            //重置错误
            _data.error = null;
            //console.log('data:',params,data);
            if (err) {

                me.saveData({error: err});
                return {error: err};
            } else {
                //处理分页逻辑
                if (me.page) {
                    _data = me.page.mixinData(_data);
                }
                //console.log(_data);
                _data = me.beforeUnify(_data);
                _data = me.unifyData(_data, me.defaultData);
                //if (me.page) {不能统一做，分页后合并数据需要在parse中自己实现，由于各个业务需要连接的字段不同
                //    _data = me.page.concatData(_data);
                //}
                _data = me.parse(_data);
                _data._state = 'CGI';
                //console.log(_data);
                //me.saveData(_data);
                return _data;
            }
        },
        /**
         * 更新数据
         * @param {Object} params 请求参数
         */
        update: function (params) {
            var _params = this.get('params') || {};
            _params = _.extend(_params, params || {});
            console.log('掉接口,', this.id, _params);
            //如果有分页重置分页数据
            if (this.page) {
                this.page.reset();
            }
            this.clearData();
            //保存参数发送请求
            this.save(_params);
            return this;
        },
        /**
         * 清空数据
         */
        clearData: function () {
            //清空数据
            this.attributes.data = {};
        },
        /**
         * 格式化数据，a_a驼峰化aA并进行默认数据处理。
         * 有defaultData时启用,没有在defaultData中定义的数据将会被忽略
         * defaultData中使用驼峰格式，也可以使用函数来计算。
         * 数据中只有undefined的部分会被替换
         * @param {Object} data 数据
         * @param {Object} def 默认模板
         * @returns {*}
         */
        unifyData: function (data, def) {
            if (def) {
                return unifyJson({
                    def: def,
                    src: data
                });
            }
            return data;
        },

        /**
         * 数据格式化前
         * @param data
         * @param opt
         */
        beforeUnify: function (data, opt) {
            //console.log('CGIdata', data);
            return data;
        },
        /**
         * 获取更多，用于分页数据场景
         */
        getMore: function () {
            var hasMore = 0;
            if (this.page) {
                hasMore = this.page.nextPage();
            }
            console.log('拉取下一页', hasMore);
            if (hasMore) {
                this.fetch();
            }
            return hasMore;
        },

        /**
         * 读取session
         * @param params
         * @returns {*}
         */
        readFromSession: function (params) {
            if (this.sessionStorage) {
                var key = (this.cgiId || this.id || this.cid) + JSON.stringify(params || this.get('params'));
                var data = this.sessionStorage.read(key);
                return data;
            } else {
                return undefined;
            }
        },
        /**
         * 存入session
         * @param data
         */
        saveToSession: function (data, params) {
            if (this.sessionStorage) {
                var key = (this.cgiId || this.id || this.cid);
                key += (typeof params == 'string') ? params : JSON.stringify(params || this.get('params'));
                this.sessionStorage.save(key, data);
            }
        },
        /**
         * 保存数据
         * @param {Object} data CGI回来的数据经过parse后的结果
         */
        saveData: function (data) {
            this.set({data: data, state: 'ready'});
            //console.warn('保存:', this.cgiId, this.get('state'), data);
        },
        /**
         * 错误处理
         * @param {String} errMsg 错误信息
         * @param {Object} params 参数
         * @param {Function} action 操作
         */
        error: function (errMsg, params, action) {
            if (typeof this.onError == 'function') {
                this.onError(errMsg, params);
            }
            (typeof action == 'function') && (action(errMsg, params));
        },

        /* ---------UNSUPPORTED 待实现------------- */
        /**
         * 初始化待实现
         */
        afterInit: UNSUPPORTED,
        /**
         * 重置前
         */
        beforeReset: UNSUPPORTED,
    });

    module.exports = DataModel;
});