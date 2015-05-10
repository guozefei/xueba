// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('xueba', ['ionic', 'xueba.controllers', 'xueba.services'])

.run(['$ionicPlatform', function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $locationProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
      url: '/dash',
      views: {
          'tab-dash': {
              templateUrl: 'templates/tab-dash.html',
              controller: 'NoteCtrl'
          }
      }
  })
  .state('tab.dash.hot', {
    url: '/hot',
    views: {
      'tab-dash-note': {
        templateUrl: 'templates/hotNote.html',
          controller: 'HottestNoteCtrl'
      }
    }
  })

  .state('tab.dash.new', {
      url: '/new',
      views: {
          'tab-dash-note': {
              templateUrl: 'templates/newNote.html',
              controller: 'NewCtrl'
          }
      }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'GalleryCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }

  })

  .state('tab.account.requireLogin', {
      url: '/login',
      views: {
          'tab-account-login': {
              templateUrl: 'templates/login.html'
          }
      }
  })
  .state('tab.account.logged', {
      url: '/logged',
      views: {
          'tab-account-login': {
              templateUrl: 'templates/logged.html',
              controller: 'LoggedCtrl'
          }
      }
  })

  .state('detail', {
        url: '/detail/:userId',
        templateUrl: 'templates/chat-detail.html',
        controller: 'ChatDetailCtrl'
    })

  .state('inspire', {
      url: '/inspire',
      templateUrl: 'templates/inspire.html'
  });

  // if none of the above states are matched, use this as the fallback
//  $urlRouterProvider.when('/tab/dash', '/tab/dash/hot');
  $urlRouterProvider.otherwise('/tab/dash');
  $ionicConfigProvider.tabs.position("bottom");
//  $locationProvider.html5Mode(true);
    function param(obj) {
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            if (obj.hasOwnProperty(name)) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        if (value.hasOwnProperty(subName)) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) +
                        '=' + encodeURIComponent(value) + '&';
                }
            }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }
    function getCookie(name) {
        var i, kv, cookie = document.cookie;
        var cookies = cookie.split(';');
        for (i = 0; i < cookies.length; i++) {
            kv = cookies[i].split('=');
            if (kv[0].trim() === name) {
                return kv[1] && kv[1].length ? kv[1] : null;
            }
        }
        return false;
    }
    var regexp = /^\/yws\/.+$/,
        keyfrom = 'mobile',
        params;
        params = {
            'keyfrom' : keyfrom
        };
    $httpProvider.defaults.headers.post['Content-Type'] =
        'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function (data) {
        return param(data);
    }];
    $httpProvider.interceptors.push((function () {
        var interceptor = function ($timeout, $q) {
            return {
                'request' : function (opt) {
                    if (!regexp.test(opt.url)) {
                        return opt;
                    }
                    if (!opt.params) {
                        opt.params = {};
                    }
                    _.extend(opt.params, params);
                    if ((/(?:\/yws\/mapi\/user)/i.test(opt.url) &&
                        opt.params && opt.params.method &&
                        ((opt.params.method === 'get') ||
                        (opt.params.method === 'regsiter') ||
                        (opt.params.method === 'edm'))) ||
                        /(?:\/yws\/mapi\/res)/i.test(opt.url) ||
                        /(?:\/yws\/mapi\/ad)/i.test(opt.url) ||
                        /(?:\/yws\/mapi\/payment)/i.test(opt.url) ||
                        /(?:\/yws\/mapi\/ilogrpt)/i.test(opt.url) ||
                        /(?:\/yws\/public)/i.test(opt.url) ||
                        /(?:\/mapi\/weibo\/share)/i.test(opt.url)) {
                        return opt;
                    }
                    if (!getCookie('YNOTE_CSTK')) {
                        return opt;
                    }
                    if (opt.method.toLowerCase() === 'get') {
                        _.extend(opt.params, {
                            cstk: getCookie('YNOTE_CSTK')
                        });
                    } else {
                        if (!opt.data) {
                            opt.data = {};
                        }
                        _.extend(opt.data, {
                            cstk: getCookie('YNOTE_CSTK')
                        });
                    }
                    return opt;
                }
            };
        };
        interceptor.$inject = ['$timeout', '$q'];
        return interceptor;
    }()));
}])
    .filter('dateFormat', ['dateFilter', function (dateFilter) {
        //TODO:移到一个独立的文件中去
        return function dateFormat(date) {
            var key,
                value,
                cache = {},
                fmt = 'yyyy.MM.dd',
                intervalTime;
            if (date === undefined) {
                return;
            }
            //发送消息的时间距离现在的秒数
            intervalTime = (new Date().getTime() - date) / 1000;
            if (intervalTime < 10) {
                return '刚刚';
            } else if (intervalTime < 30) {
                return '半分钟前';
            } else if (intervalTime < 3600) {
                //小于一个小时，显示分钟数
                if (Math.round(intervalTime / 60 < 1)) {
                    return '1分钟前';
                }
                return Math.round(intervalTime / 60) + '分钟前';
            } else if (intervalTime < 86400) {
                //小于一天大于一小时
                return Math.round(intervalTime / 3600) + '小时前';
            }
            key = (date / 1000) + '@' + fmt;
            value = cache[key];
            if (value !== undefined) {
                return value;
            }
            value = dateFilter(date, fmt);
            cache[key] = value;
            return value;
        };
    }]);
