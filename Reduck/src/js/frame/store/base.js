/**
 * 基础交互
 */

define(function (require, exports, module) {
    var constants = require('business/constants'),
        router = require('business/router'),
        env = require('business/environment'),
        _ = require('lib/underscore'),
        report= require('business/report');

    var Store = require('frame/store'),
        UNSUPPORTED = function () {
            // console.error('尚未实现')
        },
        undefind;
    var Frame = {

        test: function () {
        },
        /**
         * 更新页面标题
         * @param {String} [title=this._getTitle()]
         */
        updateTitle: function (title) {
            if (typeof title == 'string') {
                document.title = title;
                mqq && mqq.ui && mqq.ui.refreshTitle && mqq.ui.refreshTitle();
            }
        },
        /**
         * webview跳转
         * @param {String} url
         * @param {Object} [params] 参数
         * @param {Object} [o] 选项
         * @param {Boolean} [o.rightButton=false] 是否显示右上角菜单
         */
        goUrl: function (url, params, o) {
            var me = this;
            if (me.__going) return;
            params = params || {};

            // 跳转时带上这个参数，以表明使用环境
            if (constants.USE_PROD_CGI) {
                params['prodcgi'] = 1;
            }

            var wv = 1 // 隐藏底部导航
                    //+ 2    // 隐藏功能按钮
                + 1024 // 锁定竖屏
                + 32   // 隐藏功能菜单里的「复制链接」项
                + 128  // 隐藏功能菜单里的「调整字体」项
                + 256  // 隐藏功能菜单里的「用系统浏览器打开」项
                + 512  // 隐藏功能菜单里的「用QQ浏览器打开」项
                + 8192;// 隐藏功能菜单里的「收藏」项

            if (!o.rightButton)
                wv += 2;

            //防止重复加_wv
            if (!(/[\?&]_wv=\d+/.test(url)) && !params._wv)
                params._wv = wv;

            //透传参数，用于测试环境
            var reg = /\b(dev|local_cgi|prodcgi)\b/g;
            var usedParams = (location.search).match(reg);
            (usedParams || []).forEach(function (p) {
                params[p] = 1;
            });

            //这里是消除点击进入子webview后，<返回 显示成 上一个webview的标题
            var t = document.title;
            //me.updateTitle(' ');
            setTimeout(function () {
                me.updateTitle(t);
            }, 300);

            router.redirect(url, params);
            me.__going = true;
            setTimeout(function () {
                me.__going = false;
            }, 1000);
        },

        /**
         * 跳转
         * @param {String} key linkKey
         * @param {Object} params URL参数
         * @param {Object} data 替换数据
         */
        goLink: function (key, params, data) {
            data = data || {};
            params = params || {};
            var datas = Store.AMS.get('data') || {};
            var links = datas.links || {};
            var url;
            if (links[key]) {
                url = links[key].url1;
                url = url.replace(/\{([^}]*)\}/g,function($1,$2){
                    if(data[$2]){
                        return data[$2];
                    }else{
                        return ''; //$2
                    }
                });
                this.goUrl(url, params, {});
            } else {
                console.error('goLink：', '链接配置不存在', key, params, data);
            }
        },
        /**
         * 隐藏loading
         */
        hideLoading: function () {
            var dom = document.getElementById('loading');
            if (dom) {
                dom.style.display = 'none';
            }
        },
        /**
         * 显示loading
         */
        showLoading: function () {
            var dom = document.getElementById('loading');
            if (dom) {
                dom.style.display = '-webkit-box';
            }
        },
        /**
         * 显示错误提示
         * @param {String} err
         * @api public
         */
        showError: function (err, reloadable) {
            reloadable = reloadable || false;
            this.showNotice(err, reloadable, 'ui-notice');
        },

        /**
         * 显示消息提示
         * @param {String} msg
         * @param {Boolean} [reloadable=false]
         * @param {String} [cssClass='ui-notice ui-notice-news']
         * @api public
         */
        showNotice: function (msg, reloadable, cssClass) {
            var me = this;
            cssClass = cssClass || 'ui-notice ui-notice-news';
            msg = msg || '渲染异常[未知错误 -1]';
            me.hideLoading();

            var id = 'absmod_notice';
            var notice = document.getElementById(id);
            var container = document.querySelector(this.container);
            container && (container.style.display = 'none');
            if(!notice){
                notice = document.createElement('div');
                notice.id = id;
                notice.className = cssClass;
                notice.style.display = 'none';
                notice.style.position = 'fixed';
                notice.style.top = 0;
                notice.style.left = 0;
                notice.style.background = '#fff';
                document.body.appendChild(notice);
            }
            notice.innerHTML = '<section id="' + id + '" class="' + cssClass + '"><i></i><p>' + msg + '</p></section>';
            notice.style.display = 'block';
            if (reloadable) {
                notice.onclick = function () {
                    me.hideNotice();
                    me.reload();
                };
            }
        },

        /**
         * 隐藏提示模块
         */
        hideNotice: function(){
            var id = 'absmod_notice';
            var notice = document.getElementById(id);
            var container = document.querySelector(this.container);
            notice && (notice.style.display = 'none');
            container && (container.style.display = 'block');
        },
        /**
         * 上报操作
         */
        report:function(params){
            var data = {
                webId: 1801
            };
            data = _.extend(data,params);
            report.collect(data);
        },
        /**
         * 后退前的事件
         * @returns {Boolean} 返回false来禁止本次后退
         * `抽象方法`
         */
        _beforeBack: UNSUPPORTED
    };
    module.exports = Frame;

});