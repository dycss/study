/**
 * 框架驱动
 * created by donaldcen on 2015/12/17
 */
define(function(require, exports, module){

    var Frame = require('frame/main'),
        ViewModel = require('frame/model/ViewModel'),
        PageModel = require('frame/model/PageModel'),
        DataModel = require('frame/model/DataModel'),
        Dispatcher = require('frame/dispatcher/Dispatcher'),
        undefined;

    module.exports = {
        Frame: Frame,
        ViewModel: ViewModel,
        PageModel: PageModel,
        DataModel: DataModel,
        Dispatcher: Dispatcher,
        lib: {
            _: require('lib/underscore'),
            Dispatcher: require('lib/Dispatcher')
        }
    };
    
});