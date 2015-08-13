
var host = "http://101.200.188.188";
// if(window.navigator.appVersion.indexOf('Mac') > -1){
//     host = "http://m.eanet.local.wanda.cn";
// }
//
// host = "http://m.eanet.local.wanda.cn";
//setTimeout(function(){

/*
if(window.plugins && typeof device !== undefined){
    window.plugins.jPushPlugin.init();
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
                var alertContent
                if(device.platform == "Android"){
                    alertContent=window.plugins.jPushPlugin.openNotification.alert;
                }else{
                    alertContent   = event.aps.alert;
                }
                alert("open Notificaiton:"+alertContent);

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
                    window.plugins.jPushPlugin.setDebugMode(true);
                }
            }
            catch(exception){
                console.log(exception);
            }
           $("#setTagWithAliasButton").click(function(ev) {
                try{
                    var tag1 = $("#tagText1").attr("value");
                    var tag2 = $("#tagText2").attr("value");
                    var tag3 = $("#tagText3").attr("value");
                    var alias = $("#aliasText").attr("value");
                    var dd = [];

                    if(tag1==""&&tag2==""&&tag3==""){
                    }
                    else{
                        if(tag1 != ""){
                            dd.push(tag1);
                        }
                        if(tag2 != ""){
                            dd.push(tag2);
                        }
                        if(tag3 != ""){
                            dd.push(tag3);
                        }
                    }
                    window.plugins.jPushPlugin.setTagsWithAlias(dd,alias);

                }
                catch(exception){
                    console.log(exception);
                }
            })
        }
        document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
        document.addEventListener("deviceready", onDeviceReady, false);
        document.addEventListener("jpush.openNotification", onOpenNotification, false);
        document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
        document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
}

},2000);
*/
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

// document.addEventListener("deviceready", onDeviceReady, false);
angular.module('ionicApp', ['ionic', 'ngResource','storeAppFilters', 'locals'])
.run(function ($http, $ionicPlatform,ls, $rootScope,$ionicActionSheet, $timeout, $ionicPopup, $ionicLoading) {
    $rootScope.user = ls.getObject('user');
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
        window.plugins.jPushPlugin.setDebugMode(true);
        //检测更新
        checkUpdate();

        document.addEventListener("menubutton", onHardwareMenuKeyDown, false);
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
            console.log(serverAppVersion);
            if(serverAppVersion != '0.0.1'){
                $ionicLoading.show({
                    template: "请先更新程序"
                });
                window.location.href="itms-services://?action=download-manifest&url=https%3A%2F%2Fwww.pgyer.com%2Fapiv1%2Fapp%2Fplist%3FaId%3Db7918385428a4ae687bbcb0e05bd86ac%26_api_key%3D1fe17f04dfd977b9009cab3ef9ef8442";
                $timeout(function(){
                    $ionicLoading.hide();
                },2000);
            }




        })

    }

    // 显示是否更新对话框
    function showUpdateConfirm() {
        var confirmPopup = $ionicPopup.confirm({
            title: '版本升级',
            template: '1.xxxx;</br>2.xxxxxx;</br>3.xxxxxx;</br>4.xxxxxx', //从服务端获取更新的内容
            cancelText: '取消',
            okText: '升级'
        });
        confirmPopup.then(function (res) {
            if (res) {
                $ionicLoading.show({
                    template: "已经下载：0%"
                });
                var url = "http://101.200.188.188/static/meanet.apk"; //可以从服务端获取更新APP的路径
                var targetPath = "file:///storage/sdcard0/meanet.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                var trustHosts = true
                var options = {};
                var progressFunc = function (progress) {
                    //进度，这里使用文字显示下载百分比
                    $timeout(function () {
                        var downloadProgress = (progress.loaded / progress.total) * 100;
                        $ionicLoading.show({
                            template: "已经下载：" + Math.floor(downloadProgress) + "%"
                        });
                        if (downloadProgress > 99) {
                            $ionicLoading.hide();
                        }
                    })
                };
                var filetransfer = new FileTransfer(progressFunc);

                filetransfer.download(url, targetPath,function (result) {
                    // 打开下载下来的APP
                    cordova.plugins.fileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                    ).then(function () {
                            // 成功
                        }, function (err) {
                            // 错误
                        });
                    $ionicLoading.hide();
                }, function (err) {
                    alert('下载失败');
                    console.log(err);
                    $ionicLoading.hide();
                },trustHosts,options);
            } else {
                // 取消更新
            }
        });
    }
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
            if(config.url.indexOf('.html') < 0 && config.url.indexOf('refreshtoken') < 0){
              //$("#ajaxLoading").html('数据加载中，请稍等').fadeIn(500);
            }
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
            controller: "mainCtrl"
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
            }

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
            if (res.data.status === 200) {
                ls.setObject('user', res.data);

                ls.set('rememberPass', $scope.rememberPass);
                console.log($scope.rememberPass);
                $rootScope.user = res.data;
                console.log(res.data);
                $state.go('tabs.homepage');
            } else {
                $ionicLoading.show({
                    template: '登录失败',
                    duration: 2000
                });
            }

        }, function(err) {
            console.log(err);
        }).finally(function(){
            $ionicLoading.hide();
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
    .controller('HomeTabCtrl', function(CategoryService, $ionicModal, $rootScope, marketList, $scope, $timeout) {

    })
    .controller('HomepageTabCtrl', function($ionicLoading, $http, CategoryService, $ionicSlideBoxDelegate, $ionicModal, SwiperService, $ionicModal, $rootScope, marketList, $scope, $timeout) {
        $rootScope.host = host + "/";
        $scope.market_title = "药品市场";
        $scope.search = {
            // supplie_id: "",
            // supplie_name: "",
            // supplie_pingying: ""
            good_name: '',
            good_promotion:false
        };
        SwiperService.query(function(data){
            $rootScope.focus = [];
            data.forEach(function(item){
                item.src = $rootScope.host + item.src;
                $rootScope.focus.push(item);
            });
            $ionicSlideBoxDelegate.update();
        });
        SwiperService.query({type: 1}, function(data){
            $rootScope.adlist = [];
            data.forEach(function(item){
                item.src = $rootScope.host + item.src;
                $rootScope.adlist.push(item);
            });
        });
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
                }).complete(function(){
                })
            }else{
                $ionicLoading.show({
                    template: '请填写购买数量',
                    duration:2000
                });

            }
        }

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
        $scope.vieworder = function(order_id){
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
        }
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
    .controller('Promotion', function($http, $scope, $timeout, $stateParams, $ionicHistory, OrderDetailService) {

        //http://eanet.local.wanda.cn/api/push/push
        $scope.list = [];
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