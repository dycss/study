/**
 * page切换
 */
define(function (require, exports, module) {
    var domIndex = 0;
    var PageCut = {
        /**
         * 创建容器
         * @param {String | undefined} id 容器id不填默认
         * @param {document | undefined} dom
         * @param {document | undefined} container
         * @returns {*}
         */
        createContainer: function(id, dom, container){
            var newDom;
            if(!id){
                id = 'container' + domIndex++;
            }
            if(typeof dom == 'object' && dom.cloneNode){
                newDom = dom.cloneNode();
            }else{
                newDom = document.createElement('div');
            }
            newDom.id = id;
            if(!container || !container.appendChild){
                document.body.appendChild(newDom);
            }else{
                container.appendChild(newDom);
            }
            return newDom;
        },

        /**
         * 删除容器
         * @param {String | DOM} selector 选择器或DOM
         * @returns {boolean}
         */
        removeContainer: function(selector){
            var dom;
            if(typeof selector == 'string'){
                dom = document.querySelector(selector);
            }else{
                dom = selector;
            }
            if(typeof dom == 'object' && dom.removeChild){
                dom.parentNode.removeChild(dom);
                return true;
            }else{
                return false;
            }
        }
    };
    /**
     * 切换page
     * @param id
     * @param callback
     */
    module.exports = PageCut;
});