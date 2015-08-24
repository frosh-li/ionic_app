
var host = "http://101.200.188.188";
// if(window.navigator.appVersion.indexOf('Mac') > -1){
//     host = "http://m.eanet.local.wanda.cn";
// }
//
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// host = "http://m.eanet.local.wanda.cn";

var appVersion = "1.0.2";

angular.module('locals',[])
.factory('ls', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
});
var fromNotice = false;
// document.addEventListener("deviceready", onDeviceReady, false);
angular.module('ionicApp', ['ionic', 'ngResource','storeAppFilters', 'locals'])
.run(function ($state, $http, $ionicPlatform,ls, $rootScope,$ionicActionSheet, $timeout, $ionicPopup, $ionicLoading) {
    $rootScope.user = ls.getObject('user');
    fromNotice = false;
    $ionicPlatform.ready(function ($rootScope) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        window.plugins.jPushPlugin.init();
        window.plugins.jPushPlugin.setDebugMode(false);
        //检测更新
        checkUpdate();

        document.addEventListener("menubutton", onHardwareMenuKeyDown, false);
        var onDeviceReady   = function(){
            console.log("JPushPlugin:Device ready!")
            initiateUI();
        }
        var onGetRegistradionID = function(data) {
            try{
                console.log("JPushPlugin:registrationID is "+data)

                $("#registrationid").html(data);
            }
            catch(exception){
                console.log(exception);
            }
        }
        var onTagsWithAlias = function(event){
            try{
                console.log("onTagsWithAlias");
                var result="result code:"+event.resultCode+" ";
                result+="tags:"+event.tags+" ";
                result+="alias:"+event.alias+" ";
                console.log(result);
            }
            catch(exception){
                console.log(exception)
            }
        }
        var onOpenNotification = function(event){
            try{
                fromNotice = true;
                $state.go('tabs.promotion');
            }
            catch(exception){
                console.log("JPushPlugin:onOpenNotification"+exception);
            }
        }
        var onReceiveNotification = function(event){
            try{
                var alert
                if(device.platform == "Android"){
                     alert = window.plugins.jPushPlugin.receiveNotification.alert;
                }else{
                     alert   = event.aps.alert;
                }
                console.log(alert);

            }
            catch(exeption){
                console.log(exception)
            }
        }
        var onReceiveMessage = function(event){
            try{

                var message
                if(device.platform == "Android"){
                     message = window.plugins.jPushPlugin.receiveMessage.message;
                }else{
                     message   = event.content;
                }
                 //var extras = window.plugins.jPushPlugin.extras

                 $("#messageResult").html(message);

            }
            catch(exception){
                console.log("JPushPlugin:onReceiveMessage-->"+exception);
            }
        }
        var initiateUI = function(){

            try{
                window.plugins.jPushPlugin.init();
                window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);

                if(device.platform != "Android"){
                    window.plugins.jPushPlugin.setDebugModeFromIos();
                    window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                }else{
                    // window.plugins.jPushPlugin.setDebugMode(false);
                }
            }
            catch(exception){
                console.log(exception);
            }
        }
        document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
        document.addEventListener("deviceready", onDeviceReady, false);
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
        document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
    });


    // 菜单键
    function onHardwareMenuKeyDown() {
        $ionicActionSheet.show({
            titleText: '检查更新',
            buttons: [
                { text: '关于' }
            ],
            destructiveText: '检查更新',
            cancelText: '取消',
            cancel: function () {
                // add cancel code..
            },
            destructiveButtonClicked: function () {
                //检查更新
                checkUpdate();
            },
            buttonClicked: function (index) {

            }
        });
        $timeout(function () {
            hideSheet();
        }, 2000);
    };

    // 检查更新
    function checkUpdate() {
        $http.get(host+'/api/app/getVersion').success(function(data){
            var serverAppVersion = data.version; //从服务端获取最新版本
            //获取版本

                //如果本地与服务端的APP版本不符合
                console.log(serverAppVersion, appVersion);
                if(serverAppVersion != appVersion && serverAppVersion != ""){
                    $ionicLoading.show({
                        template: "请先更新程序"
                    });
                    var updateurl = window.navigator.appVersion.indexOf('Android') > -1 ?
                        "http://www.pgyer.com/apiv1/app/install?aId=1be7dff13f4dcb8a7054f9fb26cc3db4&_api_key=1fe17f04dfd977b9009cab3ef9ef8442":"itms-services://?action=download-manifest&url=https%3A%2F%2Fwww.pgyer.com%2Fapiv1%2Fapp%2Fplist%3FaId%3Dea23830af528d106945ada881d549b37%26_api_key%3D1fe17f04dfd977b9009cab3ef9ef8442";
                    window.location.href=updateurl;
                    $timeout(function(){
                        $ionicLoading.hide();
                    },2000);
                }


        })

    }
    checkUpdate();
})
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.transformRequest = function(data){
        if(typeof data === 'object'){
          var ret = [];
          for(var key in data){
            if(data.hasOwnProperty(key) && key.charAt(0) !== "$")
              ret.push(key+"="+data[key]);
          }
          return ret.join("&");
        }
      };

      $httpProvider.interceptors.push(function($q){
        return {
          'request': function(config){
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            /*

            $httpProvider.defaults.headers.post['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.put['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.common['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.post['X-UID'] = localStorage.getItem('uid');
            $httpProvider.defaults.headers.put['X-UID'] = localStorage.getItem('uid');
            $httpProvider.defaults.headers.common['X-UID'] = localStorage.getItem('uid');
            */
            return config;
          },
          'response': function(response){
            if(response.data && response.data.status == 302){
              console.log('需要登录');
              window.location = './index.html';
            }
            if(response.data && response.data.status == 301){
              console.log('权限不够');
              //throw new Error('not enough permissions');
              alert('权限不够');
              return $q.reject('not enough permissions');
            }
            if(response.data && response.data.status == 400){
              console.log(response.msg);
              alert(response.msg);
              return $q.reject(response.msg);
            }
            return response;
            //return $q.inject(response);
          }
        }
      });
        /*
      $httpProvider.responseInterceptors.push(function($q){
        return function(promise){
          return promise.then(function(response){
            //if(document.getElementById('ajaxLoading').style.display!='none'){
              //$("#ajaxLoading").html('数据加载完成').fadeOut(2000);
            //}
            console.log(response);
            if(response.data && response.data.status == 302){
              console.log('需要登录');
              window.location = './login.html';
            }
            if(response.data && response.data.status == 301){
              console.log('权限不够');
              //throw new Error('not enough permissions');
              alert('权限不够');
              return $q.reject('not enough permissions');
            }
            if(response.data && response.data.status == 400){
              console.log(response.msg);
              alert(response.msg);
              return $q.reject(response.msg);
            }
            return response;
            //return $q.inject(response);
          },function(response){
            console.log('服务器内部错误');
            alert('服务器开小差了');
            return $q.reject('服务器内部错误');
          });
        };
      });
*/
    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
        .state('signin', {
            url: '/sign-in',
            templateUrl: 'templates/sign-in.html',
            controller: 'SignInCtrl'
        })
        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: "mainCtrl",
            cache: false
        })
        .state('tabs.me', {
            url: '/me',
            views: {
                'me-tab': {
                    templateUrl: 'templates/me.html',
                    controller: 'MeCtrl'
                }
            },
            cache: false
        })
        .state('tabs.track', {
            url: '/track',
            views: {
                'track-tab': {
                    templateUrl: 'templates/track.html',
                    controller: 'TrackCtrl'
                }
            },
            cache: false
        })
        .state('tabs.submit', {
            url: '/submit',
            views: {
                'submit-tab': {
                    templateUrl: 'templates/track.html',
                    controller: 'TrackCtrl'
                }
            },
            cache: false
        })
        .state('tabs.homepage', {
            url: '/homepage',
            views: {
                'homepage-tab': {
                    templateUrl: 'templates/homepage.html',
                    controller: 'HomepageTabCtrl'
                }
            },
            cache: false
        })

        .state('tabs.promotion', {
            url: '/promotion',
            views: {
                'promotion-tab': {
                    templateUrl: 'templates/promotion.html',
                    controller: "Promotion"
                }
            },
            cache: false
        })
        ;


        $urlRouterProvider.otherwise('/sign-in');

})

.controller('BaseCtrl', function($rootScope, $http, $scope, $state, $ionicLoading) {
    $http.post(host + '/api/user/login', user).then(function(res) {
        console.log(res);
        if (res.data.status === 200) {
            $rootScope.user = res.data
            console.log(res.data);
            $state.go('tabs.home');
            /*
            if (/^1[0-9]{5}$/.test(res.data.comp_id)) {
                $state.go('tabs.home');
            } else {
                alert('登录失败，非药店账号');
            }
            */

        } else {
            $ionicLoading.show({
                template: '登录失败',
                duration:2000
            });
        }

    }, function(err) {
        console.log(err);
    });

})
.controller('SignInCtrl', function($rootScope, $http, $scope, $state, ls, $ionicLoading) {
    $scope.user = {
        username: ls.getObject('user').username,
        password: ''
    };
    if (ls.get('rememberPass') == 'true') {
        $scope.user.password = ls.get('password');
    }
    $scope.rememberPass = ls.get('rememberPass') == 'true' ? true : false;
    $scope.change = function() {
        $scope.rememberPass = $scope.rememberPass == true ? false : true;
    }
    $scope.signIn = function(user) {
        if ($scope.rememberPass == true) {
            ls.set('password', $scope.user.password);
        } else {
            ls.set('rememberPass', 'false');
        }
        $ionicLoading.show({
            template: '登录中'
        });
        $http.post(host + '/api/user/login', user).then(function(res) {
            console.log(res);
            $ionicLoading.hide();
            if (res.data.status === 200) {
                ls.setObject('user', res.data);

                ls.set('rememberPass', $scope.rememberPass);
                console.log($scope.rememberPass);
                $rootScope.user = res.data;
                console.log(res.data);
                $state.go('tabs.homepage');
            } else {
                console.log(res.data.msg);
                $ionicLoading.show({
                    template: res.data.msg||res.data.err,
                    duration: 2000
                });
            }

        }, function(err) {
        }).finally(function(){
            setTimeout(function(){
                $ionicLoading.hide();
            },5000)

        });

    };

})

.controller('mainCtrl', function($rootScope, $http, $scope, $state, $ionicLoading) {

        $scope.logout = function(user) {
            $state.go('tabs.signin');
            $http.post(host + '/api/user/logout').then(function(res) {
                $state.go('tabs.signin');
            }, function(err) {
                console.log(err);
            });
        };

        $rootScope.gotoHomePage = function(){
            // $state.go(');
        }

    })
    .factory('marketList', function($resource) {
        var params = {};
        params.page = 1;
        params.count = 12;
        params.good_name = "";
        //params.hasMore = true;
        function getList() {
            return $resource(host + '/api/items/market', {}, {
                query: {
                    method: "GET",
                    params: params
                }
            })
        }
        return {
            getList: getList,
            params: params
        }
    })
    .factory('OrderService', function($resource) {
        var params = {};
        params.page = 1;
        params.count = 10;
        //params.type = 2;
        params.ordertype = 1;
        params.showHistory = 0;
        //params.hasMore = true;
        function getList(id) {
            return $resource(host + '/api/order/order/:id', {
                "id": "@id"
            }, {
                query: {
                    method: "GET",
                    params: params
                },
                save: {
                    method:"post"
                },
                delete: {
                    method: "delete",
                    params: {
                        id: id
                    }
                }
            })
        }

        return {
            getList: getList,
            params: params
        }
    })
    .factory('HistoryOrderService', function($resource) {
        var params = {};
        params.page = 1;
        params.count = 10;
        //params.type = 2;
        params.ordertype = 1;
        params.showHistory = 1;
        //params.hasMore = true;
        function getList(id) {
            return $resource(host + '/api/order/order/:id', {
                "id": "@id"
            }, {
                query: {
                    method: "GET",
                    params: params
                },
                delete: {
                    method: "delete",
                    params: {
                        id: id
                    }
                }
            })
        }
        return {
            getList: getList,
            params: params
        }
    })
    .factory('RejectOrderService', function($resource, $rootScope) {
        var params = {};
        params.page = 1;
        params.count = 10;
        //params.type = 2;
        if ($rootScope.user.role_type == 1) {
            params.type = "supplie_id";
        }

        //params.hasMore = true;
        function getList() {
            return $resource(host + '/api/order/rejectOrder/', {}, {
                query: {
                    method: "GET",
                    params: params
                }
            })
        }
        return {
            getList: getList,
            params: params
        }
    })
    .factory('RejectOrderItemService', function($resource) {
        var params = {};
        params.page = 1;
        params.count = 10;
        //params.type = 2;
        params.order_id = 0;
        //params.hasMore = true;
        function getList(order_id) {
            params.order_id = order_id;
            return $resource(host + '/api/order/orderdetail/', {}, {
                query: {
                    method: "GET",
                    params: params
                }
            })
        }
        return {
            getList: getList,
            params: params
        }

    })
    .factory('OrderDetailService', function($resource) {
        var params = {};
        params.page = 1;
        params.count = 10;
        //params.hasMore = true;
        function getList(order_id) {
            params.order_id = order_id;
            return $resource(host + '/api/order/orderdetail/', {}, {
                query: {
                    method: "GET",
                    params: params
                }
            })
        }
        return {
            getList: getList,
            params: params
        }
    })
    .factory('CategoryService', ['$resource',
        function($resource) {
            return $resource(host + '/api/category/category', {
                id: '@id',
                search: '@search'
            }, {
                query: {
                    method: 'GET',
                    params: {},
                    isArray: false
                },
                //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
                getOne: {
                    method: 'GET',
                    params: {
                        id: "@id"
                    },
                    isArray: false
                }, //为了优化请求地址，实际上应该是{id: "@id"}
                save: {
                    method: 'POST',
                    isArray: false
                },
                update: {
                    method: "PUT",
                    isArray: false
                },
                delete: {
                    method: "DELETE",
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ])
.factory('SwiperService', ['$resource',
        function($resource) {
            return $resource(host + '/api/swiper/swiper', {
                id: '@id',
                search: '@search'
            }, {
                query: {
                    method: 'GET',
                    params: {},
                    isArray: true
                },
                //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
                getOne: {
                    method: 'GET',
                    params: {
                        id: "@id"
                    },
                    isArray: false
                }, //为了优化请求地址，实际上应该是{id: "@id"}
                save: {
                    method: 'POST',
                    isArray: false
                },
                update: {
                    method: "PUT",
                    isArray: false
                },
                delete: {
                    method: "DELETE",
                    params: {
                        id: '@id'
                    }
                }
            });
        }
    ])

    .controller('HomepageTabCtrl', function($state, OrderService, $ionicLoading, $http, CategoryService, $ionicSlideBoxDelegate, $ionicModal, SwiperService, $ionicModal, $rootScope, marketList, $scope, $timeout) {
        $rootScope.host = host + "/";
        $scope.market_title = "药品市场";
        $scope.search = {
            // supplie_id: "",
            // supplie_name: "",
            // supplie_pingying: ""
            good_name: '',
            good_promotion:false
        };
        if(!$rootScope.focus || $rootScope.focus.length < 1){
            SwiperService.query(function(data){
                $rootScope.focus = [];
                data.forEach(function(item){
                    item.src = $rootScope.host + item.src;
                    $rootScope.focus.push(item);
                });
                $ionicSlideBoxDelegate.update();
            });
        }
        if(!$rootScope.adlist || $rootScope.adlist.length < 1){
            SwiperService.query({type: 1}, function(data){
                $rootScope.adlist = [];
                data.forEach(function(item){
                    item.src = $rootScope.host + item.src;
                    $rootScope.adlist.push(item);
                });
            });
        }
        $ionicModal.fromTemplateUrl('image-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function() {
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
        $scope.$on('modal.shown', function() {
          console.log('Modal is shown!');
        });

        $scope.showBigPic = function(src) {
          console.log(src);
          console.log(this);
          $scope.imageSrc = src;

          $scope.openModal();
        }
        $timeout(function(){
            $ionicSlideBoxDelegate.$getByHandle('homepage').enableSlide(false);
        },100);

        $scope.boxgoto = function(index){
            $ionicSlideBoxDelegate.$getByHandle('homepage').slide(index);
        };
        $scope.gotoCategory = function(){
            $scope.market_title = "药品分类";
            $scope.boxgoto(2);
        }
        $scope.noMoreItemsAvailable = true;

        $scope.items = [];
        var myNavs = [];
        $scope.navs = "不限";
        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
        $scope.hasNoData = false;
        $scope.loadMore = function() {
            $timeout(function() {
                marketList.getList().query(function(res) {
                    $scope.items = $scope.items.concat(res.result);
                    if (res.result.length < marketList.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    marketList.params.page++;
                });
            }, 1000);

        };
        $scope.gotoNewOrder = function(){
            $scope.market_title = "填写订单";
            $scope.boxgoto(3);
        };
        $scope.doRefresh = function() {
            $timeout(function() {
                marketList.params.page = 1;
                if ($scope.catid > -1) {
                    marketList.params.catid = $scope.catid;
                } else {
                    delete marketList.params.catid;
                }
                // if($scope.search.good_name){
                marketList.params.good_name = $scope.search.good_name;
                // }
                marketList.getList().query(function(res) {
                    $scope.items = res.result;
                    if (res.result.length < marketList.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    if(res.result.length == 0){
                        $scope.hasNoData = true;
                    }else{
                        $scope.hasNoData = false;
                    }
                    marketList.params.page++;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                });

            }, 1000);

        };

        $scope.formData = {};
        $scope.changeNumber  =function(itemid, number){
            if(!$scope.formData[itemid]){
                $scope.formData[itemid] = 1;
                return;
            }
            $scope.formData[itemid] += number;
            if($scope.formData[itemid] < 1){
                $scope.formData[itemid] = 1;
            }
        }
        $scope.filterData = {
            category_0: -1,
            category_1: -1,
            category_2: -1,
        };

        $scope.catid = -1;
        $scope.categories_0 = [{
            id: -1,
            name: '不限'
        }];
        $scope.categories_1 = [{
            id: -1,
            name: '不限'
        }];
        $scope.categories_2 = [{
            id: -1,
            name: '不限'
        }];
        $scope.categories = CategoryService.query(function(ret){
            $scope.filterData.category_0 = ret.data[0].id;
        });
        $scope.$watch('filterData', function() {
            myNavs = [];
            console.log(myNavs);
            console.log($scope.categories);
            if ($scope.categories && $scope.categories.data)
                $scope.categories.data.forEach(function(cat) {
                    console.log('cat', cat, $scope.filterData.category_0);
                    if (cat.id == $scope.filterData.category_0) {
                        if (cat.id !== -1) {
                            myNavs.push(cat.name);
                            if (cat.children) {
                                cat.children.forEach(function(subcat) {
                                    if (subcat.id == $scope.filterData.category_1) {
                                        if (subcat.id != -1) {
                                            myNavs.push(subcat.name);
                                            if (subcat.children) {
                                                subcat.children.forEach(function(subcat2) {
                                                    if (subcat2.id == $scope.filterData.category_2) {
                                                        if (subcat2.id != -1) {
                                                            myNavs.push(subcat2.name);
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }

                    }
                    $scope.navs = myNavs.join(" > ");
                });
        }, true);
        $scope.changeCat = function(level, id) {
            switch (level) {
                case 0:
                    $scope.filterData.category_0 = id;
                    break;
                case 1:
                    $scope.filterData.category_1 = id;
                    break;
                case 2:
                    $scope.filterData.category_2 = id;
                    break;
            }

            console.log($scope.filterData);
            $scope.page = 1;
            if ($scope.filterData.category_2 > -1) {
                $scope.catid = $scope.filterData.category_2;
            } else if ($scope.filterData.category_1 > -1) {
                $scope.catid = $scope.filterData.category_1;
            } else if ($scope.filterData.category_0 > -1) {
                $scope.catid = $scope.filterData.category_0;
            }
            // $scope.catid = $scope.filterData.category_2 || $scope.filterData.category_1 || $scope.filterData.category_0;
            console.log($scope.catid);
            if(level == 2){
                $scope.parentPage = "category";
                $scope.items = [];
                $scope.boxgoto(1);
                $ionicLoading.show({
                    template: '正在加载'
                });
                $scope.doRefresh();
                $scope.market_title = "药品市场";
            }
        }
        $scope.gotoParent = function(){
            if($scope.parentPage == "search"){
                $scope.boxgoto(0);
            }else{
                $scope.gotoCategory();
            }
        }
        $scope.psearch = function(){
            $scope.page = 1;
            $scope.catid = -1;
            $scope.parentPage = "search";
            $scope.doRefresh();
            $scope.items = [];
            $scope.market_title = "搜索结果";
            $scope.boxgoto(1);
            $ionicLoading.show({
                template: '正在加载'
            });
            $timeout(function(){
                $scope.search.good_name = "";
            },1000);

        };
        $scope.$watch('filterData.category_0', function() {
            $scope.filterData.category_1 = -1;
            $scope.filterData.category_2 = -1;
            if (parseInt($scope.filterData.category_0) === -1) {
                $scope.categories_1 = [{
                    id: -1,
                    name: '不限'
                }];
                $scope.categories_2 = [{
                    id: -1,
                    name: '不限'
                }];

            } else {
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories.data && $scope.categories.data.forEach(function(item) {
                    if (item.id === parseInt($scope.filterData.category_0)) {
                        console.log(item.children);
                        $scope.categories_1 = [].concat(item.children);
                    }
                });
                console.log($scope.categories_1);
            }
        });

        $scope.$watch('filterData.category_1', function() {
            $scope.filterData.category_2 = -1;
            if (parseInt($scope.filterData.category_1) === -1) {
                $scope.categories_2 = [{
                    id: -1,
                    name: '不限'
                }];

            } else {
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories_1 && $scope.categories_1.forEach(function(item) {
                    if (item.id === parseInt($scope.filterData.category_1)) {
                        console.log(item.children);
                        $scope.categories_2 = [{
                            id: -1,
                            name: '不限'
                        }].concat(item.children);
                    }
                });
            }
        });
        $scope.buy = function(item_id, supplie_id, good_id){
            console.log(item_id);
            console.log($scope.formData);
            console.log($scope.formData[item_id]);

            var number = parseInt($scope.formData[item_id]);
            if(number > 0){
                //$scope.formData[item_id] = number;
                $scope.formData[item_id] = "";
                $http.post(host + '/api/order/master/',{
                    supplie_id: supplie_id,
                    good_id: good_id,
                    number: number
                })
                .success(function(ret){
                    if(ret.status == 200){
                        $ionicLoading.show({
                            template: '添加成功',
                            duration:2000
                        });
                    }else{
                        $ionicLoading.show({
                            template: ret.msg || '未知错误',
                            duration:2000
                        });
                    }
                })
            }else{
                $ionicLoading.show({
                    template: '请填写购买数量',
                    duration:2000
                });

            }
        }

    // 填写订单模块
    $scope.query={
        key : ""
    };
    $scope.gotoSearchSupplie = function(){
        $scope.query.key = "";
        $scope.boxgoto(4);
    };
    $scope.neworder = {
        supplie_id: "",
        order_oper: $rootScope.user.realname,
        order_beizu: "",
        order_date: (new Date()).Format("yyyyMMdd"),
        order_lastvaiddate: "",
        order_status:1,
        order_type:1,
        comp_id: $rootScope.user.comp_id
    };

    $scope.processForm = function(){
        console.log($scope.neworder);
        if(!/^2[0-9]{5}$/.test($scope.neworder.supplie_id)){
            alert('请选择供应商');
            return;
        }
        if(!/^[0-9]{8}$/.test($scope.neworder.order_date)){
            alert('请输入正确订单日期');
            return;
        }
        // if(!/^[0-9]{8}$/.test($scope.formData.order_lastvaiddate)){
        //     alert('请输入正确的交货订单日期');
        //     return;
        // }
        var order = OrderService.getList();

        var porder = new order({
            supplie_id: $scope.neworder.supplie_id,
            order_oper: $scope.neworder.order_oper,
            order_beizu: $scope.neworder.order_beizu,
            order_date: $scope.neworder.order_date,
            order_lastvaiddate: $scope.neworder.order_lastvaiddate,
            order_status:$scope.neworder.order_status,
            order_type:$scope.neworder.order_type,
            comp_id: $scope.neworder.comp_id
        });
        console.log(order,porder);
        if(!$scope.neworder.supplie_id){
            $ionicLoading.show({
                template:"请选择供应商",
                duration:2000
            });
            return;
        }
        porder.$save(function(ret){
            if(ret.msg || ret.err){
                $ionicLoading.show({
                    template: ret.msg || ret.err,
                    duration:2000
                });
                return;
            }
            if(ret.status == 200){
                $ionicLoading.show({
                    template:"新增订单成功",
                    duration:2000
                });
                $scope.neworder = {
                    supplie_id: "",
                    order_oper: $rootScope.user.realname,
                    order_beizu: "",
                    order_date: (new Date()).Format("yyyyMMdd"),
                    order_lastvaiddate: "",
                    order_status:1,
                    order_type:1,
                    comp_id: $rootScope.user.comp_id
                };
                // $state.go('tabs.submit');
            }
        });
    }
    $scope.SearchComp = function(){
        if($scope.query.key == ""){
            $ionicLoading.show({
                template:"请输入搜索关键字",
                duration:2000
            });
            return;
        }
        $http.get(host + '/api/comp/suggest?companyid='+$rootScope.user.comp_id+'&query='+$scope.query.key).success(function(ret){
            console.log(ret);
            if(ret.status == 200 && ret.data && ret.data.length > 0){
                $scope.suggest_comp_list = ret.data;
            }else{
                $ionicLoading.show({
                    template:"无法查询到内容，请更换搜索关键字重试",
                    duration:2000
                });
            }
        })
    }
    $scope.selectCompany = function(id, name){
        $scope.suggest_comp_list = [];
        $scope.neworder.supplie_name = name;
        $scope.neworder.supplie_id = id;
        $scope.boxgoto(3);
    };
    // api/comp/suggest?companyid=200001&query=a
})
.controller('MeCtrl', function($state, $http, CategoryService, $ionicSlideBoxDelegate, $ionicModal, SwiperService, $ionicModal, $rootScope, marketList, $scope, $timeout, $ionicLoading) {
        $rootScope.host = host + "/";
        $scope.promotions = [];
        $timeout(function(){
            $ionicSlideBoxDelegate.$getByHandle('homepage').enableSlide(false);
        },100);

        $scope.getPush = function() {
            $ionicLoading.show({
                template:"正在加载"
            });
            $scope.promotions = [];
            $http.get(host + '/api/push/push').success(function(ret) {
                $scope.promotions = ret;
            }).finally(function() {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        // $scope.getPush();
        $scope.market_title = "我的";
        $scope.search = {
            // supplie_id: "",
            // supplie_name: "",
            // supplie_pingying: ""
            good_name: '',
            good_promotion:false
        };
        if($rootScope.focus && $rootScope.focus.length > 0){
            $scope.list = $rootScope.focus;
        }else{
            SwiperService.query(function(data){
                $scope.list = [];
                data.forEach(function(item){
                    item.src = $rootScope.host + item.src;
                    $scope.list.push(item);
                });
                $ionicSlideBoxDelegate.update();
            });
        }

        $ionicModal.fromTemplateUrl('image-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });

        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function() {
          // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
        $scope.$on('modal.shown', function() {
          console.log('Modal is shown!');
        });



        $scope.boxgoto = function(index){
            if(index == 0){
                $scope.market_title = "我的";
            }
            $ionicSlideBoxDelegate.$getByHandle('homepage').slide(index);

        };

        $scope.gotoCategory = function(){
            market_title = "药品分类";
            $scope.getPush();
            $scope.boxgoto(2);
        }
        $scope.gotoPromotion = function(){
            $scope.market_title = "促销信息";
            $scope.getPush();
            $scope.boxgoto(1);
        };
        $scope.logout = function(){
            $state.go('signin');
        };
        $scope.gotoAboutUs = function(){
            $scope.market_title = "关于我们";
            $scope.boxgoto(2);
        };
        $scope.gotoFeedback = function(){
            $scope.market_title = "意见反馈";
            $scope.boxgoto(3);
        };
        $scope.feedbackmsg = "";
        $scope.postFeedback = function(feedbackmsg){
            feedbackmsg = feedbackmsg.replace(/\s/g,"");
            $http.post(host + "/api/app/feedback", {
                feedback: feedbackmsg
            }).success(function(ret) {

                if (ret.status == 500) {
                    $ionicLoading.show({
                        template: ret.err || ret.msg,
                        duration: 2000
                    });
                } else if (ret.status == 200) {
                    $ionicLoading.show({
                        template: '提交成功',
                        duration: 2000
                    });
                    // window.location.reload();
                }
            });
        }

        $scope.gotoChangePass = function(){
            $scope.market_title="修改密码";
            $scope.boxgoto(4);
        };
        $scope.cpass = {
            newpass:"",
            oldpass:"",
            newpass2: ""
        };
        $scope.processPass = function(){
            if($scope.cpass.oldpass == "" || $scope.cpass.newpass=="" || $scope.cpass.newpass2 ==""){
                $ionicLoading.show({
                    template:"密码不能为空",
                    duration:2000
                })
                return;
            }
            if($scope.cpass.newpass != $scope.cpass.newpass2){
                $ionicLoading.show({
                    template:"两次新密码不一致，请重新输入",
                    duration:2000
                });
                return;
            }

            $http.post(host + '/api/user/changepass', {
                password: $scope.cpass.newpass,
                oldpass:$scope.cpass.oldpass
            }).success(function(ret) {
                if (ret.status == 200) {
                    $ionicLoading.show({
                        template: '密码修改成功，请重新登录',
                        duration: 2000
                    });
                    $rootScope.user = null;

                    $state.go('signin');
                } else {
                    $ionicLoading.show({
                        template: ret.err || ret.msg,
                        duration: 2000
                    });
                }

            });
            console.log($scope.cpass);
        }
    })

    .controller('TrackCtrl', function($ionicLoading,RejectOrderItemService, OrderDetailService, SwiperService,$ionicSlideBoxDelegate, OrderService, $rootScope, $scope, $timeout, $state, $http) {
        var inSubmit = $state.current.name == "tabs.submit" ? 1 : 0;
        $scope.hasNoData = false;
        console.log($state);
        $scope.market_title=inSubmit ? "订单提交":"订单追踪";
        $scope.currentOrderStatus = inSubmit ? 1 : 2;
        $scope.tabtype = 0;
        $timeout(function(){
            $ionicSlideBoxDelegate.$getByHandle('homepage').enableSlide(false);
        },100);
        $scope.boxgoto = function(index){
            $ionicSlideBoxDelegate.$getByHandle('homepage').slide(index);
        };
        $ionicLoading.show({
            template: '正在加载'
        });
        OrderService.params.order_status = $scope.currentOrderStatus;
        $scope.changeTab = function(type, order_status){
            if(type == 1){
                $scope.currentOrderStatus = -1;
                $scope.items = [];
                OrderService.params.showHistory = 1;
                OrderService.params.order_status = -1;
                OrderService.params.reject=1;
            }else{
                $scope.currentOrderStatus = order_status;
                $scope.items = [];
                OrderService.params.showHistory = type == 2 ? 1 : 0;
                OrderService.params.order_status = order_status;
                OrderService.params.reject = -1;
            }
            $ionicLoading.show({
                template:"正在加载"
            });
            $scope.doRefresh();
        }
        $scope.noMoreItemsAvailable = false;
        console.log(OrderService);
        $rootScope.host = host + "/";
        // $scope.showHistory = window.location.hash === "#/tab/history" ? 1 : 0;
        $scope.items = [];
        OrderService.params.showHistory = $scope.tabtype == 2 ? 1 : 0;
        $scope.active = OrderService.params.ordertype;


        if($rootScope.focus && $rootScope.focus.length > 0){
            $scope.list = $rootScope.focus;
        }else{
            SwiperService.query(function(data){
                $scope.list = [];
                data.forEach(function(item){
                    item.src = $rootScope.host + item.src;
                    $scope.list.push(item);
                });
                $ionicSlideBoxDelegate.update();
            });
        }

        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";

        OrderService.params.page = 1;
        if ($rootScope.user.role_type == 1) {
            OrderService.params.type = 2;
        }
        $scope.loadMore = function() {
            $timeout(function() {
                OrderService.getList().query(function(res) {
                    $scope.items = $scope.items.concat(res.result);
                    if (res.result.length < OrderService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    OrderService.params.page++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }, 1000);

        };
        $scope.doRefresh = function() {
            $timeout(function() {
                OrderService.params.page = 1;
                OrderService.getList().query(function(res) {
                    $scope.items = res.result;
                    if (res.result.length < OrderService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    if($scope.items.length == 0){
                        $scope.hasNoData = true;
                    }else{
                        $scope.hasNoData = false;
                    }
                    OrderService.params.page++;
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');

                });
            }, 1000);

        }
        $scope.doRefresh();
        $scope.setOrderType = function(type) {
            OrderService.params.ordertype = type;
            OrderService.params.page = 1;
            $scope.active = type;
            $scope.items = [];
            OrderService.getList().query(function(res) {
                // console.log(res);
                $scope.items = $scope.items.concat(res.result);
                console.log($scope.items);
                if (res.result.length < OrderService.params.count) {
                    $scope.noMoreItemsAvailable = true;
                } else {
                    $scope.noMoreItemsAvailable = false;
                }
                OrderService.params.page++;
            });
        };
        $scope.goto = function(order_id, supplie_id, order_status) {
            $state.go('vieworder', {
                order_id: order_id,
                supplie_id: supplie_id,
                order_status: order_status
            });
        };
        $scope.noMoreItemsAvailableItem = false;
        $scope.vieworder = function(order_id, supplie_id, order_status, itemcount){
            if(itemcount < 1){
                $ionicLoading.show({
                    template: "该订单暂无药品，请先添加药品",
                    duration:3000
                });
                return;
            }
            $scope.market_title = "订单详情";
            OrderDetailService.params.page = 1;
            $scope.order_id = order_id;
            $scope.orderItems = [];
            OrderDetailService.getList(order_id).query(function(res) {
                $scope.orderItems = $scope.orderItems.concat(res.result);

                if (res.result.length < OrderDetailService.params.count) {
                    $scope.noMoreItemsAvailableItem = true;
                } else {
                    $scope.noMoreItemsAvailableItem = false;
                }
                OrderDetailService.params.page++;
            });
            $scope.boxgoto(1);
        };
        $scope.noMoreItemsAvailableItem = true;
        $scope.loadMoreItems = function(){
            OrderDetailService.getList($scope.order_id).query(function(res) {
                $scope.orderItems = $scope.orderItems.concat(res.result);

                if (res.result.length < OrderDetailService.params.count) {
                    $scope.noMoreItemsAvailableItem = true;
                } else {
                    $scope.noMoreItemsAvailableItem = false;
                }
                OrderDetailService.params.page++;
            });
        }
        $scope.loadMoreRejectDetails = true;
        $scope.formData = [];
        $scope.gotoRejectSlide = function(order_id, supplie_id){
            $scope.market_title="拒收";
            $scope.rejectItems = [];
            $scope.companyid = supplie_id;
            $scope.order_id = order_id;
            $scope.boxgoto(2);
            RejectOrderItemService.params.page = 1;
            RejectOrderItemService.getList(order_id).query(function(res) {
                $scope.rejectItems = $scope.rejectItems.concat(res.result);

                $scope.formData = [];
                res.result.forEach(function(item, index) {
                    $scope.formData.push({
                        oid: item.oid,
                        good_reject: item.good_reject,
                        good_id: item.good_id
                    });
                });
                if (res.result.length < RejectOrderItemService.params.count) {
                    $scope.loadMoreRejectDetails = true;
                } else {
                    $scope.loadMoreRejectDetails = false;
                }
                RejectOrderItemService.params.page++;
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');

        }
        $scope.rejectItems = [];
        $scope.loadMoreRejectItems = function(){
            RejectOrderItemService.getList($scope.order_id).query(function(res) {
                $scope.rejectItems = $scope.rejectItems.concat(res.result);
                if (res.result.length < RejectOrderItemService.params.count) {
                    $scope.loadMoreRejectDetails = true;
                } else {
                    $scope.loadMoreRejectDetails = false;
                }
                RejectOrderItemService.params.page++;
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }


        $scope.processForm = function() {
            var oid = [],
                good_reject = [];
            $scope.formData.forEach(function(item) {
                oid.push(item.oid);
                good_reject.push(item.good_reject);
            });

            $http.post(host + '/api/order/rejectItems', {
                orderid: $scope.order_id,
                good_reject: good_reject.join("|"),
                oid: oid.join("|")
            }).success(function(ret) {
                if (ret.status == 200) {
                    $ionicLoading.show({
                        template: '拒收成功，请等待确认',
                        duration: 2000
                    });
                    window.history.back();
                } else {
                    $ionicLoading.show({
                        template: '拒收失败，请刷新页面重试',
                        duration: 2000
                    });
                }

            });
        };
        // var Api = $resource('');
        $scope.noMoreItemsAvailable = false;
        RejectOrderItemService.params.page = 1;
        $scope.items = [];

        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";

        $scope.loadMoreDetails = function(){
            OrderDetailService.getList(order_id).query(function(res) {
                $scope.orderItems = $scope.orderItems.concat(res.result);

                if (res.result.length < OrderDetailService.params.count) {
                    $scope.noMoreItemsAvailableItem = true;
                } else {
                    $scope.noMoreItemsAvailableItem = false;
                }
                OrderDetailService.params.page++;
            });
        }
        $scope.gotoCurrentHome = function(){
            $scope.market_title = "订单追踪";
            $scope.boxgoto(0);
        };
        $scope.del = function(id) {
            var order = new OrderService.getList(id);
            order.delete(function(ret) {
                console.log(ret);
                if (ret.status == 500) {
                    $ionicLoading.show({
                        template: '系统错误' + "\n" + ret.err,
                        duration: 2000
                    });
                    return;
                }
                $ionicLoading.show({
                    template: '删除成功',
                    duration: 2000
                });
                $scope.doRefresh();
                // window.location.reload();
            })
        }
        $scope.submitOrder = function(order_id) {
            console.log($rootScope.user.role_type);
            var url = $rootScope.user.role_type == 1 ? "/api/order/orderPFSubmit" : "/api/order/orderSubmit";
            $http.post(host + url, {
                order_id: order_id
            }).success(function(ret) {
                if (ret.status == 500) {
                    $ionicLoading.show({
                        template: ret.err || ret.msg,
                        duration: 2000
                    });
                } else if (ret.status == 200) {
                    $ionicLoading.show({
                        template: '提交订单成功',
                        duration: 2000
                    });
                    // window.location.reload();
                    $scope.doRefresh();
                }
            });
        }
        $scope.gotoReject = function(order_id, supplie_id) {
            $state.go('rejectOrderItem', {
                order_id: order_id,
                supplie_id: supplie_id
            });
            // $scope.items = [];
        };
        // 添加药品 3 4
        // 填写订单模块
        // /api/items/suggestHAS?companyid=200004&query=z
        $scope.additems = function(order_id,supplie_id){
            console.log('add items');
            $scope.market_title = "选择药品";
            $scope.search_companyid =supplie_id;
            $scope.selectedOrderId = order_id;
            $scope.boxgoto(3);
        };
        $scope.query={
            key : ""
        };
        $scope.gotoSearchGood = function(){
            $scope.query.key = "";
            $scope.boxgoto(4);
        };
        $scope.neworder = {
            good_name: "",
            good_id:"",
            good_number: 1,
            order_id:$scope.selectedOrderId
        };

        $scope.sumbitGood = function(){
            console.log($scope.neworder);
            $scope.neworder.order_id = $scope.selectedOrderId;
            if($scope.neworder.good_id == ""){
                $ionicLoading.show({
                    template:"请选择药品",
                    duration:2000
                })
                return;
            }
            if($scope.neworder.good_number < 1){
                $ionicLoading.show({
                    template:"最少购买数量需要大于0",
                    duration:2000
                })
                return;
            }
            $http.post(host+'/api/order/orderdetail',{
                good_id:$scope.neworder.good_id,
                good_number:$scope.neworder.good_number,
                order_id:$scope.neworder.order_id,
            }).success(function(ret){
                if(ret.status == 200){
                    $scope.market_title = "提交订单";
                    // $scope.boxgoto(0);
                    $ionicLoading.show({
                        template:"添加成功",
                        duration:1000
                    });
                    $scope.neworder = {
                        good_name: "",
                        good_id:"",
                        good_number: 1,
                        order_id:$scope.selectedOrderId
                    };
                    // $scope.doRefresh();
                }else{
                    $ionicLoading.show({
                        template:ret.msg || ret.err,
                        duration:2000
                    })
                }
            });
        }
        $scope.goReturnSubmit = function(){
            $ionicLoading.show({
                template:'正在加载'
            });
            $scope.doRefresh();
            $scope.boxgoto(0);
        }
        $scope.SearchGood = function(companyid){
            if($scope.query.key == ""){
                $ionicLoading.show({
                    template:"请输入搜索关键字",
                    duration:2000
                });
                return;
            }
            $http.get(host+'/api/items/suggestHAS?companyid='+$scope.search_companyid+'&query='+$scope.query.key).success(function(ret){
                console.log(ret);
                if(ret.status == 200 && ret.data && ret.data.length > 0){
                    $scope.suggest_comp_list = ret.data;
                }else{
                    $ionicLoading.show({
                        template:"无法查询到内容，请更换搜索关键字重试",
                        duration:2000
                    });
                }
            })
        }
        $scope.selectCompany = function(id, name){
            $scope.suggest_comp_list = [];
            $scope.neworder.good_name = name;
            $scope.neworder.good_id = id;
            $scope.boxgoto(3);
        };
    })

    .controller('RejectOrder', function($http, RejectOrderService, $state, $stateParams, $scope, $timeout) {
        $scope.noMoreItemsAvailable = false;
        console.log(RejectOrderService);
        $scope.items = [];

        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
        $scope.loadMore = function() {
            $timeout(function() {
                RejectOrderService.getList().query(function(res) {
                    $scope.items = $scope.items.concat(res.result);
                    if (res.result.length < RejectOrderService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    RejectOrderService.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

        };
        $scope.doRefresh = function() {
            $timeout(function() {
                RejectOrderService.params.page = 1;
                RejectOrderService.getList().query(function(res) {
                    $scope.items = res.result;
                    if (res.result.length < RejectOrderService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    RejectOrderService.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);
            $scope.$broadcast('scroll.refreshComplete');
        }
        RejectOrderService.getList().query(function(res) {
            // console.log(res);
            $scope.items = $scope.items.concat(res.result);
            console.log($scope.items);
            if (res.result.length < RejectOrderService.params.count) {
                $scope.noMoreItemsAvailable = true;
            } else {
                $scope.noMoreItemsAvailable = false;
            }
            RejectOrderService.params.page++;
        });
        $scope.confirmReject = function(order_id) {
            $http.post(host + '/api/order/rejectOrder', {
                order_id: order_id
            }).success(function(ret) {
                if (ret.status == 200) {
                    $ionicLoading.show({
                        template: '确认拒收成功',
                        duration: 2000
                    });
                    window.location.reload();
                } else {
                    $ionicLoading.show({
                        template: '拒收失败，请刷新页面重试',
                        duration: 2000
                    });
                }

            });
        };
        $scope.setOrderType = function(type) {
            RejectOrderService.params.ordertype = type;
            RejectOrderService.params.page = 1;
            $scope.items = [];
            RejectOrderService.getList().query(function(res) {
                // console.log(res);
                $scope.items = $scope.items.concat(res.result);
                console.log($scope.items);
                if (res.result.length < RejectOrderService.params.count) {
                    $scope.noMoreItemsAvailable = true;
                } else {
                    $scope.noMoreItemsAvailable = false;
                }
                RejectOrderService.params.page++;
            });
        }
        $scope.gotoRejectView = function(order_id) {
            $state.go('rejectOrderItemView', {
                order_id: order_id
            })
        };
        $scope.confirmReject = function(order_id) {
            $http.post(host + '/api/order/rejectOrder', {
                order_id: order_id
            }).success(function(ret) {
                if (ret.status == 200) {
                    $ionicLoading.show({
                        template: '确认拒收成功',
                        duration: 2000
                    });
                    window.location.reload();
                } else {
                    $ionicLoading.show({
                        template: '拒收失败，请刷新页面重试',
                        duration: 2000
                    });
                }

            });
        };
    })
    .controller('RejectOrderItem', function($ionicHistory, $scope, $timeout, $stateParams, $http, RejectOrderItemService) {
        var orderid = $scope.orderid = $stateParams.order_id;
        $scope.companyid = $stateParams.supplie_id;
        $scope.processForm = function() {
            var oid = [],
                good_reject = [];
            $scope.formData.forEach(function(item) {
                oid.push(item.oid);
                good_reject.push(item.good_reject);
            });

            $http.post(host + '/api/order/rejectItems', {
                orderid: $scope.orderid,
                good_reject: good_reject.join("|"),
                oid: oid.join("|")
            }).success(function(ret) {
                if (ret.status == 200) {
                    $ionicLoading.show({
                        template: '拒收成功，请等待确认',
                        duration: 2000
                    });
                    window.history.back();
                } else {
                    $ionicLoading.show({
                        template: '拒收失败，请刷新页面重试',
                        duration: 2000
                    });
                }

            });
        };
        // var Api = $resource('');
        $scope.noMoreItemsAvailable = false;
        RejectOrderItemService.params.page = 1;
        $scope.items = [];
        $scope.formData = [];
        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
        $scope.loadMore = function() {
            $timeout(function() {
                RejectOrderItemService.getList(orderid).query(function(res) {
                    $scope.items = $scope.items.concat(res.result);
                    if (res.result.length < RejectOrderItemService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    RejectOrderItemService.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

        };
        RejectOrderItemService.getList(orderid).query(function(res) {

            $scope.items = $scope.items.concat(res.result);
            $scope.formData = [];
            res.result.forEach(function(item, index) {
                $scope.formData.push({
                    oid: item.oid,
                    good_reject: item.good_reject,
                    good_id: item.good_id
                });
            });
            if (res.result.length < RejectOrderItemService.params.count) {
                $scope.noMoreItemsAvailable = true;
            } else {
                $scope.noMoreItemsAvailable = false;
            }
            RejectOrderItemService.params.page++;
        });
        $scope.goBack = function() {
            $ionicHistory.goBack();
        };

    })
    .controller('ViewOrder', function($scope, $timeout, $stateParams, $ionicHistory, OrderDetailService) {

        var order_id = $scope.order_id = $stateParams.order_id;
        $scope.supplie_id = $stateParams.supplie_id;
        $scope.order_status = $stateParams.order_status;
        OrderDetailService.params.page = 1;
        $scope.goBack = function() {
            $ionicHistory.goBack();
        };

        $scope.noMoreItemsAvailable = false;

        $scope.items = [];
        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
        $scope.loadMore = function() {
            $timeout(function() {
                OrderDetailService.getList(order_id).query(function(res) {
                    $scope.items = $scope.items.concat(res.result);
                    if (res.result.length < OrderDetailService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    OrderDetailService.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

        };
        OrderDetailService.getList(order_id).query(function(res) {

            $scope.items = $scope.items.concat(res.result);

            if (res.result.length < OrderDetailService.params.count) {
                $scope.noMoreItemsAvailable = true;
            } else {
                $scope.noMoreItemsAvailable = false;
            }
            OrderDetailService.params.page++;
        });
    })
    .controller('Promotion', function($ionicSlideBoxDelegate, $http, $scope, $timeout, $stateParams, $ionicHistory, OrderDetailService) {

        //http://eanet.local.wanda.cn/api/push/push
        if(fromNotice){
            fromNotice = false;
        };
        $scope.list = [];
        $timeout(function(){
            $ionicSlideBoxDelegate.$getByHandle('homepage').enableSlide(false);
        },100);
        $scope.getPush = function() {
            $scope.list = [];
            $http.get(host + '/api/push/push').success(function(ret) {
                $scope.list = ret;

            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        $scope.getPush();

    });