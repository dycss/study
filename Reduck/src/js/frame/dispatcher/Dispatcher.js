/**
 * 项目调度器 单例唯一的
 */
define(function(require, exports, module){
    var Dispatcher = require('frame/lib').Dispatcher;

    var AppDispatcher = new Dispatcher();

    /**
     * 调度器使用规范
     * 触发
     * Dispatcher.dispatch({moduleId: "router", actionId: actionId, params: params});
     */
    module.exports = AppDispatcher;
});