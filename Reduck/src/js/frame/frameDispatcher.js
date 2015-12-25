define(function (require, exports, module) {
    var Dispatcher = require('frame/dispatcher/Dispatcher');
    //注册总线事件
    Dispatcher.register(function (payload) {
        var moduleId = payload['moduleId'];
        var actionId = payload['actionId'];
        var actionModule = actions[moduleId];
        var action = actionModule && actions[moduleId][actionId];
        if (typeof action == 'function') {
            action.apply(actionModule, payload['params']);
        }
    });

    var actions = {};

    module.exports = {
        /**
         * 添加处理方法
         * @param {String} moduleId 模块id
         * @param {String} actionId 操作id
         * @param {Function} fn 操作方法
         */
        add: function (moduleId, actionId, fn) {
            if (typeof fn == 'function') {
                (!actions[moduleId]) && (actions[moduleId] = {});
                actions[moduleId][actionId] = fn;
            }
        },
        /**
         * 批量添加
         * @param {String} moduleId 模块id
         * @param {Object} obj 模块对象
         */
        addAll: function (moduleId, obj) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i + '')) {
                    this.add(moduleId, i, obj[i].bind(obj));
                }
            }
        },
        /**
         * 移出方法
         * @param {} moduleId
         * @param actionId
         */
        remove: function (moduleId, actionId) {
            if (actions.moduleId && actions.moduleId.actionId) {
                actions.moduleId.actionId = null;
                delete actions.moduleId.actionId;
            }
        },
        get: function (moduleId, actionId) {
            if(moduleId){
                if(actionId && actions[moduleId]){
                    return actions[moduleId][actionId];
                }else{
                    return actions[moduleId];
                }
            }else{
                return actions;
            }
        }
    };

});