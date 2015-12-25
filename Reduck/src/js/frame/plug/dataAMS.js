/**
 *  AMS模块
 *  Created by donaldcen on 2015/11/19
 */
define(function (require, exports, module) {
    var DataModel = require('frame/index').DataModel;
    var AMS = require('business/ams');

    var AMSConfig = DataModel.extend({
        defaults: {
            params: {},
            data: {}
        },
        initialize: function () {
            this.ams = new AMS(this.id);
            if (this.defaultData) {
                this.set('data', this.defaultData);
            }
            if (typeof this.init == 'function') {
                this.init();
            }
        },
        request: function (params, options) {
            var me = this;
            if (this.ams.id) {
                this.ams.get(function (err, data) {
                    var _data = data || {};
                    if(err){
                        me.error(err, params, options.error);
                    }else{
                        //_data = me.unifyData(_data, me.defaultData);
                        _data = me.parse(_data, options);
                        me.saveData(_data);
                    }
                });
            }
        }
    });
    module.exports = AMSConfig;

});