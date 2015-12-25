/**
 * 框架驱动
 * created by donaldcen on 2015/12/17
 */
define(function(require, exports, module){

    module.exports = {
        _: require('lib/underscore'),
        Dispatcher: require('lib/Dispatcher'),
        Backbone : require('lib/backbone'),
        React: require('lib/react-addons'),
        ReactDOM: require('lib/react-dom')
    };

});