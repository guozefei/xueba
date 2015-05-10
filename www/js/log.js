/**
 * Created by Guo Zefei on 2015/5/7.
 */
(function () {
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    __rl_npid = "ynote-market";
    (function() {
        var _rl = document.createElement('script');
        _rl.type = 'text/javascript'; _rl.async = true;
        _rl.src = 'http://rlogs.youdao.com/rlog.js';

        __rl_click = true;
        __rl_post = [];

        __rl_post.push(['PV', 'index']);
        var keyfrom;
        if (getParameterByName('keyfrom')) {
            keyfrom = 'xueba2_' + getParameterByName('keyfrom');
        }
        if (keyfrom) {
            __rl_post.push(['keyfrom', keyfrom]);
        }
        var vendor = getParameterByName('vendor');
        if (vendor) {
            __rl_post.push(['vendor', vendor]);
        }
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(_rl, s);
    })();
}());