/**
 * 状态机
 * Created by donaldcen on 2015/12/25
 */
//(function () {


    /**
     * 状态机
     * @constructor
     */
    function State(status, start) {
        this.tasks = [];
        this.index = start || 0;
        if (typeof status == 'object') {

        } else {
            this.set(0, status);
        }
    }

    State.prototype = {
        set: function (index, value) {
            var me = this;
            if (typeof index == 'object') {
                Object.keys(index).forEach(function (key) {
                    me.tasks[key] = index[key];
                });
            } else {
                this.tasks[Number(index)] = value;
            }
            return this;
        },
        get: function (index) {
            index = (typeof index != 'undefined') ? index : this.index;
            return this.tasks[index];
        },
        reset: function () {
            this.index = 0;
            return this;
        },
        next: function () {
            return this.tasks(++this.index);
        }
    };


    //if (typeof module == 'object' && module.exports) {
    //    module.exports = State;
    //} else {
    //    return State;
    //}
    module.exports = 'hello wor;d'//State;
//})();
