/**
 * 分页模型mixin
 * created by donaldcen on 2015/11/13
 */
define(function (require, exports, module) {
    var _ = require('lib/underscore');
    var PageMixin = function (opt) {
        this.pageOpt = _.extend({
            name_pageId: 'page_id',
            name_pageLen: 'num_per_page',
            name_hasMore: 'has_more',
            num_everyPage: 25,
            num_startPage: 0,
            num_maxPage: null,
            is_hasMore: null
        }, opt);
        this.pageOpt.num_nowPage = this.pageOpt.num_startPage;
        return this;
    };
    PageMixin.prototype = {
        pageOpt: {},
        nextPage: function () {
            if (this.get('tag_hasMore')) {
                this.set({
                    num_nowPage: this.get('num_nowPage') + 1
                });
                return true;
            } else {
                return false;
            }

        },
        /**
         * 混入分页参数
         * @param {Object} params 原请求参数
         * @returns {*}
         */
        mixinParam: function (params) {
            var opts = this.pageOpt || {};
            params[opts.name_pageId] = opts.num_nowPage;
            params[opts.name_pageLen] = opts.num_everyPage;
            return params;
        },
        /**
         * 混入响应数据
         * @param {Object} data 响应数据
         */
        mixinData: function (data) {
            data.hasMore = this.hasMore(data);
            this.set({tag_hasMore: data.hasMore});
            return data;
        },
        /**
         * 判断是否有更多
         * @param {Object} data 来源数据
         * @returns {boolean}
         */
        hasMore: function (data) {
            //通过用户自定义方法判断
            if (typeof this.get('is_hasMore') == 'function') {
                return this.get('is_hasMore')(data);
            }
            //自动判断数据内标识
            if (typeof data[this.get('name_hasMore')] != 'undefined') {
                return !!data[this.get('name_hasMore')];
            }
            //自动比较页码范围
            if (typeof this.get('num_maxPage') == 'number') {
                return this.get('num_maxPage') >= this.get('num_nowPage');
            }
        },
        /**
         * 重置页码
         */
        reset: function () {
            this.set({
                num_nowPage: this.get('num_startPage'),
                tag_hasMore: true //重置下一页标志
            });
        },
        set: function (opt) {
            this.pageOpt = _.extend(this.pageOpt, opt || {});
        },
        get: function (id) {
            return this.pageOpt[id];
        }
    };
    module.exports = function (opt) {

        return {page: new PageMixin(opt)};
    };

});