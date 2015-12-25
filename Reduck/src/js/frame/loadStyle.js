/**
 * 样式加载模块
 * created by donaldcen on 2015/11/18
 */
define(function (require, exports, module) {

    var cssCache = {};
    var idlen = 0;
    var stylePrev = 'style-';
    module.exports = {
        addStyle: function (styleSheet) {
            var id = styleSheet.id;
            var dom;
            idlen++;
            if (cssCache[id]) {
                dom = document.getElementById(stylePrev + id);
            }
            if (!dom) {
                dom = document.createElement('style');
                dom.id = stylePrev + id;
                dom.innerHTML = styleSheet.style;
                document.head.appendChild(dom);
            }else{
                dom.innerHTML = styleSheet.style;
            }
            styleSheet.dom = dom;
            cssCache[id] = styleSheet;
        },
        addStyles: function(cssList){
            var me = this;
            (cssList || []).forEach(function(styleSheet){
                me.addStyle(styleSheet);
            });
        },
        removeStyle: function(ids){
            var me = this;
            if(typeof ids == 'string'){
                ids = [ids];
            }
            (ids || []).forEach(function(id){
                if(cssCache[id]){
                    cssCache[id].dom.remove();
                    cssCache[id] = null;
                    delete  cssCache[id];
                }
            });
        }
    };
});