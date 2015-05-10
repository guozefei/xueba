/**
 * Created by Zefei Guo on 2015/5/4.
 */
(function(){
    wx.config({
        debug: false,
        appId: _wx_auth.appId,
        timestamp: _wx_auth.timestamp,
        nonceStr: _wx_auth.nonceStr,
        signature: _wx_auth.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo'
        ]
    });
    wx.ready(function () {
        var wxInfo = {
            title: '参与「 有道云笔记 · 学霸笔记 」 现场膜拜美国哈佛大学', // 分享标题
            desc: '学霸一出手，凡人都住口！最强学霸笔记等你来show！',
            link: 'http://'+ window.location.host +'/xueba/mobile/?keyfrom=weixin_mobile', // 分享链接
            imgUrl:'http://'+ window.location.host +'/xueba/mobile/img/share_weixin.jpg'
        };
        wx.onMenuShareTimeline({
            title: wxInfo.title, // 分享标题
            desc: wxInfo.desc, // 分享描述
            link: wxInfo.link, // 分享链接
            imgUrl: wxInfo.imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareAppMessage({
            title: wxInfo.title, // 分享标题
            desc: wxInfo.desc, // 分享描述
            link: wxInfo.link, // 分享链接
            imgUrl: wxInfo.imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareWeibo({
            title: wxInfo.title, // 分享标题
            desc: wxInfo.desc, // 分享描述
            link: 'http://'+ window.location.host +'/xueba/mobile/?keyfrom=weibo_mobile', // 分享链接
            imgUrl: wxInfo.imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareQQ({
            title: wxInfo.title, // 分享标题
            desc: wxInfo.desc, // 分享描述
            link: 'http://'+ window.location.host +'/xueba/mobile/?keyfrom=qq_mobile', // 分享链接
            imgUrl: wxInfo.imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });
    });
}());