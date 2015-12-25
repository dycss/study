/**
 * mqq相关模块
 */
define(function (require, exports, module) {
    var mqqShare = require('util/mqqShare');
    module.exports = {
        initMQQ: function () {
            if (mqq) {
                this.bindBackEvent();
            }
        },
        bindBackEvent: function () {
            var me = this;
            if (mqq.ui) {
                mqq.ui && mqq.ui.setOnCloseHandler(function () {
                    if (me.back()) {
                        //SPA还没返回到底
                        //SPA处理
                    } else {
                        //到底手Q返回
                        mqq.ui.popBack();
                    }
                });
            }
        },
        refreshTitle: function (title) {
            if (title) {
                document.title = title;
            }
            if (mqq && mqq.ui && mqq.ui.refreshTitle) {
                mqq.ui.refreshTitle();
            }
        },
        /**
         * 设置右上角分享
         * @param title  右上角的分享内容
         * @param params  分享的内容
         * @param callback  分享的回调
         */
        setShareButton: function (title, params, callback) {
            var params = params || {};
            if (!mqq || !mqq.ui) {
                return;
            }
            mqq.ui.setOnShareHandler(function (type) {
                mqq.ui.shareMessage({
                    title: params.title || '加入QQ公会，玩游戏不再孤单',
                    desc: params.desc || '有福利，有礼包，你还不来？',
                    image_url: params.imgUrl || 'http://imgcache.gtimg.cn/club/mqqgame/league_hall_index/201512151756_hall_index_share.png',
                    share_url: params.shareUrl || 'http://' + location.hostname + location.pathname + '?_wv=1985&module=home',
                    back: params.back || true,
                    share_type : type
                }, function (result) {
                    if (typeof callback == 'function') {
                        callback(type, result)  ;
                    }
                })
            });
            mqq.ui.setTitleButtons({
                right: {
                    title: title || '',
                    callback: function () {
                        //首先清除焦点
                        document.activeElement && document.activeElement.blur();
                        mqq.ui.showShareMenu();
                    }
                }
            });
        },

        /**
         * 隐藏右上角按钮
         * @api protected
         */
        hideRightButton: function () {
            if (mqq.ui) {
                if (mqq.ui.setTitleButtons) {
                    var right = {hidden: true};
                    mqq.ui.setTitleButtons({right: right});
                }
                else {
                    mqq.ui.setActionButton({hidden: true}, function () {
                    });
                }
            }
        }
    };

});