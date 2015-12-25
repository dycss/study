/**
 * view 模型 -Backbone View
 * Create by donaldcen on 2015/11/12
 */
define(function (require, exports, module) {
    var lib = require('frame/lib');
    var Backbone = lib.Backbone;
    var _ = lib._;
    var React = lib.React;
    var ReactDOM = lib.ReactDOM;
    var GetData = require('util/getData');
    var RENDER_TYPE = {
        'normal': 0, // 默认开始就渲染
        'afterData': 1, //等待数据
        'isMust': 2 //必须的
    };
    var UNSUPPORTED = function () {
        // console.error('尚未实现，待具体业务实现')
    };
    window.React = React;
    window.ReactDOM = ReactDOM;
    var View = Backbone.View.extend({
        /**
         * 初始化
         * @param opts
         */
        initialize: function (opts) {
            _.extend(this, opts);
            if (typeof this.init == 'function') {
                this.init(opts);
            }
            //this.models = opts.models;
            //this.onError = opts.onError /*|| (function(){console.error(arguments)})*/;
            this.beforeRender();
            this.addClassName();
            this.render();
            this._afterRender();
        },
        addClassName: function () {
            this.el.className = this.elClassName || '';
        },
        /**
         * 创建框架
         * @param {String} id div#id
         * @returns {Element}
         */
        createContainer: function (id, className) {
            var dom = document.createElement('div');
            dom.id = id;
            dom.className = className || '';
            return dom;
        },
        /**
         * 自行调用，启动渲染
         */
        refresh: function(){
            this.ready();
            (typeof this.show == 'function') && (this.show());
        },
        beforeRender: UNSUPPORTED,
        ready: UNSUPPORTED,

        getRenderType: function(renderType){
            if(typeof renderType == 'string'){
                renderType = renderType.split(' ');
            }
            var _renderType = {};
            (renderType || []).forEach(function(item){
                _renderType[item] = true;
            });
            return _renderType;
        },
        /**
         * render 渲染
         */
        render: function () {
            var me = this;
            this.el.innerHTML = '';
            //TODO
            //this.el.style.display = 'none';
            var _components;
            for (var c in this.components) {
                if ((_components = this.components[c]).component) {
                    //获取渲染类型
                    _components._renderType = this.getRenderType(_components.renderType);
                    //计算容器
                    if(!_components.container){
                        _components._container = me.createContainer(c, this.components[c].className);
                        me.el.appendChild(_components._container);
                    }else if(typeof _components.container == 'string'){
                        _components._container = document.querySelector(_components.container);
                    }

                    //bind Model
                    me.bindModel(_components.models, me.renderComponent.bind(me, _components));

                    me.renderComponent(_components);

                }
            }
            this.el.style.display = 'block';
            this._isRender = true;
        },

        /**
         * 获取还在执行的模块数量
         * @returns {Number}
         */
        getDoing: function(){
            var components = this.components;
            var array = Object.keys(components);
            var len = array.length;
            var doing = [];
            array.forEach(function(key){
                if(components[key].state == 'ready'){
                    len--;
                }else{
                    doing.push(components[key]);
                }
            });
            return doing;
        },

        _afterRender: function(){
            this._loadingEvent();
            this.afterRender();
        },

        _loadingEvent: function(){
            var dom = document.getElementById('loading');
            if(dom){
                dom.onclick = function(){
                    dom.style.display = 'none';
                }
            }
        },

        /**
         * 渲染完成
         */
        afterRender: UNSUPPORTED,
        /**
         * 绑定数据
         * @param {Array | String} modelIds modelId
         * @param {Function} callback 回调
         */
        bindModel: function (modelIds, callback) {
            callback = callback || (function () {
                });
            var models = this.models;
            if (typeof modelIds == 'string') {
                modelIds = [modelIds];
            }
            (modelIds || []).forEach(function (id) {
                if (models[id]) {
                    models[id].on('change:data', callback);
                }
            });
        },
        /**
         * 移出绑定
         * @param modelIds
         */
        unbindModel: function (modelIds) {
            var models = this.models;
            if (typeof modelIds == 'string') {
                modelIds = [modelIds];
            }
            (modelIds || []).forEach(function (id) {
                if (models[id]) {
                    models[id].off('change:data');
                }
            });
        },
        /**
         * 组织提供组件的props
         * @param {Array | String} modelIds modelID
         * @returns {{actions: *}}
         */
        buildProps: function (modelIds) {
            var models = this.models;
            if (!models) {
                return {};
            }
            var props = {
                actions: models.actions
            };
            var error = null;

            if (typeof modelIds == 'string') {
                modelIds = [modelIds];
            }
            var state = modelIds.length || 0;
            (modelIds || []).forEach(function (id) {
                if (models[id]) {
                    props[id] = models[id].get('data');
                    console.log(id,models[id].get('state'));
                    (models[id].get('state') == 'ready') && state--;
                    if(props[id].error){
                        error = props[id].error;
                    }
                }
            });
            props.state = state;
            //view模块的处理器
            if (typeof this.parseProps == 'function') {
                props.error = error;
                props = this.parseProps(props) || props;
            }
            props.error = error;
            props.state = state;
            props.get = GetData.get;
            return props;
        },
        /**
         * 渲染组件
         * @param {Object} config 组件配置{component: Reactxxx, models: ['AMS'], container: DOM}
         */
        renderComponent: function (config) {
            var me = this;
            if (config.component) {
                var props = this.buildProps(config.models);//获取组件的model组织props
                console.log(config.id, props);
                //必要组件错误退出
                if(props.error && config._renderType['isMust'] && typeof  this.onError == 'function'){
                    this.onError(props.error);
                    return false;
                }
                //afterData组件判断
                if(config._renderType['afterData'] && props.state > 0){
                    return false;
                }
                if(props.state == 0){
                    config.state = 'ready';
                    console.info(config.id + ' is ready', ',doing: ', this.getDoing());
                }
                //组件单元数据校验
                if (typeof config.test == 'function' && !config.test(props)){
                    return false;
                }
                //组件数据格式化
                if (typeof config.dataParse == 'function') {
                    props = config.dataParse(props) || props;
                }

                //为props提供便捷get方法
                props.get = GetData.get;
                config._reactComponent = (ReactDOM.render(React.createElement(config.component, props), config._container, function(){
                    //console.info('渲染',config.id, props, config._container, config._reactComponent);
                    if(typeof config.afterRender == 'function'){
                        config.afterRender(props, config);
                    }
                    me.afterRenderComponent(config, props);
                }));

                if(this.getDoing().length <= 1){
                    this.refresh();
                }

            }
        },
        /**
         * 组件渲染后
         * @param {Object} config 组件配置{component: Reactxxx, models: ['AMS'], container: DOM}
         */
        afterRenderComponent: function(config){
            if(!this._isStartRender){
                this._isStartRender = true;
            }
        },
        destroy: function () {
            //首先清除焦点
            document.activeElement && document.activeElement.blur();
            var modelIds, container;
            for (var c in this.components) {
                if (modelIds = this.components[c].models) {
                    this.unbindModel(modelIds);
                }
                if(container = this.components[c]._container){
                    try{
                        ReactDOM.unmountComponentAtNode(container);
                    }catch(e){
                        console.error('react回收失败', e.message);
                    }
                }
            }
        }
    });
    module.exports = View;
});