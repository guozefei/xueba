(function () {
    var user = {};
    function setUser(json) {
        user = json;
    }
    function getUser () {
        return user;
    }
    function toShare(note) {
        location.href = 'http://note.youdao.com/share?id=' + note.id + '&type=notebook';
    }
    angular.module('xueba.controllers', [])
        .controller('XuebaCtrl', ['$scope', '$location', function ($scope, $location) {
            var alreadyLogged = false;
            $scope.fromXuebaGame = false;
            $scope.thirdTabTitle = '我要当学霸';
            $scope.toXueba = function () {
                if (alreadyLogged) {
                    $location.path('/detail/' + getUser().userId);
                } else {
                    $location.path('/tab/account');
                }
            };
            $scope.$on('xueba.fromXuebaGame', function ($evt, fromXuebaGame) {
                $scope.fromXuebaGame = fromXuebaGame;
            });
            $scope.$on('xueba.xuebaLogged', function ($evt, userId) {
                $scope.thirdTabTitle = '个人页';
                alreadyLogged = true;
            });
        }])
        .controller('NoteCtrl', ['$scope', '$location', function ($scope, $location) {
            if (!/new/.test($location.url())) {
                $scope.isHot = true;
                $location.path('/tab/dash/hot');
            } else {
                $scope.isHot = false;
                $location.path('/tab/dash/new');
            }
            $scope.showHot = function () {
                $scope.isHot = true;
            };
            $scope.showNew = function () {
                $scope.isHot = false;
            };
            $scope.loadMore = function () {
                $scope.$broadcast('note.getMore', $scope.isHot);
            };
            $scope.$on('note.getMore.finished', function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
            $scope.toShare = toShare;
        }])
        .controller('HottestNoteCtrl', ['$scope', 'noteService',function ($scope, noteService) {
            var pageNum = 0,
                pageSize = 6;
            $scope.noteList = [];
            noteService.getHotNotes(0 ,pageSize)
                .then(function (notes) {
                    $scope.noteList = notes;
                }, function (e) {
                });
            $scope.leftNoteList = [];
            $scope.rightNoteList = [];

            $scope.$on('note.getMore', function ($evt, isHot) {
                if (!isHot || $scope.noteList.length === 0 || $scope.noteList.length % pageSize !== 0) {
                    $scope.$emit('note.getMore.finished');
                    return;
                }
                pageNum = $scope.noteList.length / pageSize;
                noteService.getHotNotes(pageNum*pageSize, pageSize)
                    .then(function (moreNotes) {
                        $scope.noteList = $scope.noteList.concat(moreNotes);
                    }).finally(function () {
                        $scope.$emit('note.getMore.finished');
                    });
            });

            function distributeNotes() {
                $scope.leftNoteList = [];
                $scope.rightNoteList = [];
                if ($scope.noteList.length === 0) {
                    return;
                }
                for(var i=0;i<$scope.noteList.length;i++) {
                    if (i % 2 == 0 ) {
                        $scope.leftNoteList.push($scope.noteList[i]);
                    } else {
                        $scope.rightNoteList.push($scope.noteList[i]);
                    }
                }
            }

            $scope.$watchCollection('noteList', function () {
                distributeNotes();
            }, true);
        }])
        .controller('NewCtrl', ['$scope', '$filter', 'noteService', function ($scope, $filter, noteService) {
            var check,
                pageNum = 0,
                pageSize = 6;
            $scope.noteList = [];
            noteService.getNewNotes(0 ,pageSize)
                .then(function (notes) {
                    $scope.noteList = notes;
                }, function (e) {
                    //获取最新笔记失败
                });
            $scope.leftNoteList = [];
            $scope.rightNoteList = [];
            function distributeNotes() {
                $scope.leftNoteList = [];
                $scope.rightNoteList = [];
                if ($scope.noteList.length === 0) {
                    return;
                }
                for(var i=0;i<$scope.noteList.length;i++) {
                    $scope.noteList[i].updateTimeText = $filter('dateFormat')( $scope.noteList[i].createTime);
                    if (i % 2 == 0 ) {
                        $scope.leftNoteList.push($scope.noteList[i]);
                    } else {
                        $scope.rightNoteList.push($scope.noteList[i]);
                    }
                }
            }
            $scope.$on('note.getMore', function ($evt, isHot) {
                if (isHot || $scope.noteList.length === 0 || $scope.noteList.length % pageSize !== 0) {
                    $scope.$emit('note.getMore.finished');
                    return;
                }
                pageNum = $scope.noteList.length / pageSize;
                noteService.getNewNotes(pageNum*pageSize, pageSize)
                    .then(function (moreNotes) {
                        $scope.noteList = $scope.noteList.concat(moreNotes);
                    }).finally(function () {
                        $scope.$emit('note.getMore.finished');
                    });
            });
            $scope.$watchCollection('noteList', function () {
                distributeNotes();
            }, true);
            $scope.$watch(function () {
                return $scope.isHot;
            }, function (isHot) {
                if (isHot) {
                    clearInterval(check);
                } else {
                    check = setInterval(function () {
                        distributeNotes();
                    }, 10000);
                }
            });
        }])
        .controller('GalleryCtrl', ['$scope', '$timeout', '$location', '$stateParams', 'noteService', function ($scope, $timeout, $location, $stateParams, noteService) {
            var pageNum = 0,
                pageSize = 6,
                keyword;
            keyword = $location.search().keyword;
            $scope.noteList = [];
            $scope.toShare = toShare;

            $scope.leftNoteList = [];
            $scope.rightNoteList = [];
            $scope.search = function () {
                $timeout(function () {
                    document.getElementById('search').blur();
                }, 0);
                if (!$scope.keyword) {
                    return;
                }
                $location.search('keyword', $scope.keyword);
                $scope.noteList = [];
                $scope.leftNoteList = [];
                $scope.rightNoteList = [];
                $scope.noResult = false;
                noteService.getNotesByKeyword($scope.keyword, 0, pageSize)
                    .then(function (notes) {
                        $scope.noteList = notes;
                        if (notes.length === 0) {
                            $scope.noResult = true;
                        }
                    }, function (e) {
                        //获取搜索结果失败
                    });
            };
            function distributeNotes() {
                $scope.leftNoteList = [];
                $scope.rightNoteList = [];
                if ($scope.noteList.length === 0) {
                    return;
                }
                for(var i=0;i<$scope.noteList.length;i++) {
                    if (i % 2 == 0 ) {
                        
                        $scope.leftNoteList.push($scope.noteList[i]);
                    } else {
                        $scope.rightNoteList.push($scope.noteList[i]);
                    }
                }
            }

            $scope.loadMore = function () {
                if ($scope.noteList.length === 0 || $scope.noteList.length % pageSize !== 0) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    return;
                }
                pageNum = $scope.noteList.length / pageSize;
                if ($scope.keyword) {
                    //有关键字搜索加载更多
                    noteService.getNotesByKeyword($scope.keyword, pageNum*pageSize, pageSize)
                        .then(function (moreNotes) {
                            $scope.noteList = $scope.noteList.concat(moreNotes);
                        }).finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                } else {
                    //没有关键字搜索加载更多，实际上与最热笔记一样
                    noteService.getHotNotes(pageNum*pageSize, pageSize)
                        .then(function (moreNotes) {
                            $scope.noteList = $scope.noteList.concat(moreNotes);
                        }).finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                }
            };
            $scope.$watchCollection('noteList', function () {
                distributeNotes();
            }, true);
            if (keyword) {
                $scope.keyword = keyword;
                $scope.search(keyword);
            } else {
                //刚进来的时候关键字为空，实际上是最热笔记
                noteService.getHotNotes(0 ,pageSize)
                    .then(function (notes) {
                        $scope.noteList = notes;
                    }, function (e) {
                        //获取最热笔记失败
                    });
            }
        }])

        .controller('ChatDetailCtrl', ['$scope', '$stateParams', 'userService', 'noteService', function ($scope, $stateParams, userService, noteService) {
            //TODO 增加cache，如果以前访问过就直接用cache的信息，但是如果cache的话会出现修改无法得到的情况，需要再考虑
            var userId = $stateParams.userId,
                tempUser = getUser();
            $scope.toShare = toShare;
            if (tempUser && userId === tempUser.userId) {
                $scope.thirdIcon = '个人页';
            } else {
                $scope.thirdIcon = '我要当学霸';
            }
            function getNotes (userId) {
                noteService.listNotes(userId, 0, 10000)
                    .then(function (notes) {
                        //获取当前学霸所有笔记成功
                        $scope.noteList = notes;
                    }, function (e) {
                        //获取当前学霸所有笔记失败
                    });
            }
            userService.getXuebaInfo(userId)
                .then(function (xuebaInfo) {
                    //获取学霸信息成功
                    $scope.xueba = xuebaInfo.xueba;
                    $scope.noteCount = xuebaInfo.noteCount;
                    $scope.pvCount = xuebaInfo.pvCount;
                    $scope.shareCount = xuebaInfo.shareCount;
                    getNotes($scope.xueba.userId);
                }, function (e) {
                    //获取学霸信息失败
                });
            $scope.refresh = function () {
                getNotes(userId);
            };
        }])

        .controller('AccountCtrl', ['$scope', '$state', '$location', 'userService', 'loginService', function ($scope, $state, $location, userService, loginService) {
            $scope.fromXuebaGame = $location.search().fromXuebaGame ? JSON.parse($location.search().fromXuebaGame) : false;
            $scope.showAnimation = false;
            $scope.inLoggedPage = false;
            $scope.share = function () {
                $scope.showAnimation = true;
            };
            $scope.hideShare = function () {
                $scope.showAnimation = false;
            };
            $scope.$emit('xueba.fromXuebaGame', $scope.fromXuebaGame);

            loginService.YnoteLogin.check(function (isLogin) {
                if (isLogin) {
                    //already logged
                    userService.getCurrentUserInfo()
                        .then(function (json) {
                            $scope.userJson = json;
                            setUser({userId:json.uid});
                            userService.isXueba(json.uid)
                                .then(function (isXueba) {
                                    if (isXueba) {
                                        if (!$scope.fromXuebaGame) {
                                            $location.path('/detail/' + json.uid);
                                            //登录了并且已经是学霸，那么第三个Tab显示个人页
                                            $scope.$emit('xueba.xuebaLogged', json.uid);
                                        }
                                    } else {
                                        $scope.inLoggedPage = true;
                                        $state.go('tab.account.logged');
                                    }
                                }, function () {
                                    $state.go('tab.account.requireLogin');
                                })
                        }, function (e) {
                            $state.go('tab.account.requireLogin');
                        });
                } else {
                    //not logged
                    $state.go('tab.account.requireLogin');
                }
            });
            $scope.login = function () {
                var url = $scope.fromXuebaGame ? encodeURIComponent('http://note.youdao.com/xueba/mobile/#/tab/account?fromXuebaGame=true') :
                    encodeURIComponent('http://note.youdao.com/xueba/mobile/#/tab/account');
                location.href = 'http://note.youdao.com/oauth/login_mobile.html?back_url=' + url;
                <!-- @ifdef DEBUG -->
                location.href =  'http://reg.163.com/login.jsp?url='
                    + url;
                <!-- @endif -->
            };
        }])
        .controller('LoggedCtrl', ['$scope', '$state', '$location', '$timeout', '$ionicPopup', '$ionicScrollDelegate', 'userService', function ($scope, $state, $location, $timeout, $ionicPopup, $ionicScrollDelegate, userService) {
            var tempSchool = {};
            $scope.showLogin = true;
            $scope.showMoreSchool = true;
            $scope.hideLogin = function () {
                $scope.showLogin = false;
            };
            $timeout(function () {
                $ionicScrollDelegate.scrollTo(0, 1850);
            }, 0);
            $scope.allSchoolList = [];
            for(var i=0;i<schoolList.length;i++) {
                for (var j=0;j<schoolList[i].school.length;j++) {
                    tempSchool = schoolList[i].school[j];
                    tempSchool.provinceId = schoolList[i].id;
                    $scope.allSchoolList.push(tempSchool);
                }
            }
            $scope.user = {photo: 'img/default_portrait.jpg',
                userId: $scope.userJson ? $scope.userJson.uid : ''};
            $scope.schools = [];
            $scope.academies = [];
            $scope.years = ['2000', '2001', '2002', '2003','2004', '2005','2006', '2007','2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'];
            $scope.selectSchool = function (school) {
                $scope.school = school.name;
                $scope.academies = major[school.id];
                $timeout(function () {
                    $scope.showMoreSchool = false;
                }, 50);
            };
            $scope.selectMajor = function () {
                if ($scope.academies.length === 0) {
                    $ionicPopup.alert({
                        title: '请从列表中选择学校~',
                        okText: '知道了~'
                    });
                }
            };
            $scope.$watch('school', function (inputSchool) {
                $scope.showMoreSchool = true;
                $scope.schools = _.reject($scope.allSchoolList, function (school) {
                    return school.name.indexOf(inputSchool) === -1;
                })
            });
            $scope.$watch('userJson', function (userJson) {
                if (!userJson) {
                    return;
                }
                $scope.user.userId = userJson.uid;
            });

            function showAlert() {
                $ionicPopup.alert({
                    title: '亲，您还没填写完整哟~',
                    okText: '知道了~'
                });
            }

            $scope.register = function () {
                if ($scope.user.photo === 'img/default_portrait.jpg') {
                    $scope.photoUrl = undefined;
                }
                if ($scope.name && $scope.school && $scope.year && $scope.major && $scope.phone) {
                    userService.registerNewXueba($scope.name, $scope.photoUrl, $scope.school, $scope.year, $scope.major, $scope.phone, $scope.reason)
                        .then(function (xueba) {
                            //注册成功，跳到自己的学霸详情页
                            $location.path('/detail/' + xueba.userId);
                            //注册成功，那么第三个Tab显示个人页
                            $scope.$emit('xueba.xuebaLogged', xueba.userId);
                        }, function () {
                            //注册失败
                        });
                } else {
                    showAlert();
                }
            };

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

            var imageEl = document.getElementById('photo'),
                formData,
                image,
                xhr = new XMLHttpRequest(),
                cstk = getCookie('YNOTE_CSTK'),
                url = '/yws/api/image?method=upload&cstk=' + cstk,
                responseObject;

            imageEl.onchange = function () {
                if (imageEl.files.length === 0) {
                    return;
                }
                formData = new FormData();
                image = imageEl.files[0];
                formData.append('image', image);
                xhr.open('POST', url);
                xhr.onreadystatechange = onReadyStateChange;
                xhr.send(formData);
                function onReadyStateChange() {
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    $scope.$apply(function () {
                        if (xhr.status >= 200 && xhr.status < 400) {
                            responseObject = JSON.parse(xhr.response);
                            $scope.user.photo = '/yws/api/image/' + responseObject.imagePath +'?method=getTempUpload'
                            $scope.photoUrl = responseObject.imagePath;
                        } else if (xhr.status >= 400) {
                            if (xhr.responseText && JSON.parse(xhr.responseText).error && JSON.parse(xhr.responseText).error == '10011') {
                                $ionicPopup.alert({
                                    title: '图片不要大于2M~',
                                    okText: '知道了~'
                                });
                            }
                        } else if (xhr.status === 0) {

                        }
                    });
                }
            };
        }]);
}());
