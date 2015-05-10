angular.module('xueba.services', [])

    .service('noteService',['$http', '$q', 'userService', function ($http, $q, userService) {
        function Note(json) {
            return {
                userId: String(json.userId || ''),
                id: String(json.id || ''),
                title: String(json.title || ''),
                createTime: Number(json.createTime || 0),
                university: String(json.university || ''),
                major: String(json.major || ''),
                shareCount: Number(json.displayShareCount || 0),
                pvCount: Number(json.pvCount || 0),
                description: String(json.description || '')
            }
        }
        function getHotNotes(begin, number) {
            var defer = $q.defer();
            $http.post('/yws/mapi/xueba?method=hottest', {
                begin : _.isNumber(begin) ? begin : 0,
                count : _.isNumber(number) ? number : 6
            }).success(function (array) {
                var notes = [];
                _.each(array.notes, function (noteJson) {
                    notes.push(new Note(noteJson));
                });
                for (var i=0; i<array.xuebas.length;i++) {
                    notes[i].xueba = new userService.Xueba(array.xuebas[i]);
                }
                defer.resolve(notes);
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        function getNewNotes(begin, number) {
            var defer = $q.defer();
            $http.post('/yws/mapi/xueba?method=newest', {
                begin : _.isNumber(begin) ? begin : 0,
                count : _.isNumber(number) ? number : 6
            }).success(function (array) {
                var notes = [];
                _.each(array.notes, function (noteJson) {
                    notes.push(new Note(noteJson));
                });
                for (var i=0; i<array.xuebas.length;i++) {
                    notes[i].xueba = new userService.Xueba(array.xuebas[i]);
                }
                defer.resolve(notes);
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        function getNotesByKeyword (keyword, begin, number) {
            var defer = $q.defer();
            $http.post('/yws/mapi/xueba?method=search', {
                keyword: keyword,
                begin: begin,
                count: number,
                sort: 'display_share_count',
                desc: false
            }).success(function (array) {
                var notes = [];
                _.each(array.notes, function (noteJson) {
                    notes.push(new Note(noteJson));
                });
                for (var i=0; i<array.notes.length;i++) {
                    notes[i].xueba = new userService.Xueba(array.xuebas[i]);
                }
                defer.resolve(notes);
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        function listNotes(userId, begin, number) {
            var defer = $q.defer();
            $http.post('/yws/mapi/xueba?method=list', {
                xuebaId: userId,
                begin:  _.isNumber(begin) ? begin : 0,
                count: _.isNumber(number) ? number : 6,
                sort: 'display_share_count', //按收藏数排序
                desc: true  //降序
            }).success(function (array) {
                var notes = [];
                _.each(array, function (json) {
                    notes.push(new Note(json));
                });
                defer.resolve(notes);
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        this.Note= Note;
        this.getHotNotes = getHotNotes;
        this.getNewNotes = getNewNotes;
        this.getNotesByKeyword = getNotesByKeyword;
        this.listNotes = listNotes;
    }])
    .service('loginService', ['$http', '$state', function ($http, $state) {
        var YnoteLogin =  {
            check: function (cb) {
                var self = this;
                $http.get('/login/acc/pe/getsess?product=YNOTE', {
                    params: {
                        product: 'YNOTE',
                        _: new Date().getTime()
                    }
                }).finally(function() {
                    self.changeUrsCookie(cb);
                });
            },
            changeUrsCookie: function (cb) {
                var self = this;
                $http.get('/auth/urs/login.json', {
                    params: {
                        app: 'web',
                        _: new Date().getTime()
                    }
                }).success(function(data){
                    if(data.login && _.isFunction(cb)) {
                        cb.call(this, true);
                    } else {
                        self.checkcq(cb);
                    }
                }).error(function () {
                        $state.go('tab.account.requireLogin');
                    });
            },
            checkcq: function (cb) {
                var self = this;
                $http.get('/auth/cq.json', {
                    params: {
                        app: 'web',
                        _: new Date().getTime()
                    }
                }).success(function(data){
                    if(data.user && data.user.login && _.isFunction(cb)) {
                        cb.call(this, true);
                    } else {
                        cb.call(this, false);
                    }
                }).error(function (e) {
                    $state.go('tab.account.requireLogin');
                });
            }
        };
        this.YnoteLogin = YnoteLogin;
    }])
    .service('userService', ['$http', '$q', function ($http, $q) {
        function Xueba(json) {
            var tempPhoto;
            if (!/\./.test(json.photo)) {
                tempPhoto = 'img/default_portrait.jpg';
            } else {
                tempPhoto = json.photo || 'img/default_portrait.jpg';
            }
            return {
                userId: String(json.userId || ''),
                name: String(json.name || ''),
                photo: tempPhoto,
                university: String(json.university || ''),
                admissionYear: String(json.admissionYear || ''),
                major: String(json.major || ''),
                phone: String(json.phone || ''),
                address: String(json.address || ''),
                post: String(json.post || ''),
                createTime: Number(json.createTime || 0),
                description: String(json.description || '')
            }
        }
        function getCurrentUserInfo () {
            var defer = $q.defer();
            $http.get('/yws/mapi/user', {
                params : {
                    method: 'get'
                }
            }).success(function (json) {
                defer.resolve(json);
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        function isXueba (userId) {
            var defer = $q.defer();
            $http.post('/yws/mapi/xueba?method=isXueba', {
                xuebaId: userId
            }).success(function (isXueba) {
                defer.resolve(JSON.parse(isXueba));
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        function registerNewXueba (name, photoUrl, university, year, major, phone, reason) {
            var defer = $q.defer();
            $http.post('/yws/mapi/xueba?method=register', {
                name: name,
                photoUrl: photoUrl,
                university: university,
                year: year,
                major: major,
                phone: phone,
                description: reason
            }).success(function (json) {
                defer.resolve(new Xueba(json));
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        function getXuebaInfo (userId) {
            var defer = $q.defer();
            $http.post('/yws/mapi/xueba?method=getXueba', {
                xuebaId: userId
            }).success(function (xuebaJson) {
                defer.resolve({
                    'xueba': new Xueba(xuebaJson.xueba),
                    'noteCount': xuebaJson.noteCount || 0,
                    'pvCount': xuebaJson.pvCount || 0,
                    'shareCount': xuebaJson.shareCount || 0
                });
            }).error(function (e) {
                defer.reject(e);
            });

            return defer.promise;
        }
        this.Xueba = Xueba;
        this.getCurrentUserInfo = getCurrentUserInfo;
        this.isXueba = isXueba;
        this.registerNewXueba = registerNewXueba;
        this.getXuebaInfo = getXuebaInfo;
    }]);
