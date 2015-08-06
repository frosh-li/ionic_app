
var host = "http://101.200.188.188";
// if(window.navigator.appVersion.indexOf('Mac') > -1){
//     host = "http://m.eanet.local.wanda.cn";
// }
setTimeout(function(){


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
                $("#tagAliasResult").html(result);
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
                $("#notificationResult").html(alert);

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
            $ionicLoading.show({
                template: "请先更新程序"
            });

            window.location.href="itms-services://?action=download-manifest&url=https%3A%2F%2Fwww.pgyer.com%2Fapiv1%2Fapp%2Fplist%3FaId%3Db7918385428a4ae687bbcb0e05bd86ac%26_api_key%3D1fe17f04dfd977b9009cab3ef9ef8442";
            $timeout(function(){
                $ionicLoading.hide();
            },2000);

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
      console.log($httpProvider);
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
        .state('vieworder', {
            url: '/vieworder/:order_id/:supplie_id/:order_status',
            templateUrl: 'templates/vieworder.html',
            controller: 'ViewOrder',
            cache: false
        })
        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: "mainCtrl"
        })
        .state('tabs.home', {
            url: '/home',
            views: {
                'home-tab': {
                    templateUrl: 'templates/home.html?' + Date.now(),
                    controller: 'HomeTabCtrl'
                }
            }
        })
        .state('tabs.order', {
            url: '/order',
            views: {
                'order-tab': {
                    templateUrl: 'templates/order.html',
                    controller: "OrderList"
                }
            }
        })
        .state('tabs.history', {
            url: '/history',
            views: {
                'history-tab': {
                    templateUrl: 'templates/history.html',
                    controller: "HistoryOrderList"
                }
            }
        })
        .state('rejectOrderItem', {
            url: '/rejectOrderItem/:order_id/:supplie_id',
            templateUrl: 'templates/rejectOrderItem.html',
            controller: "RejectOrderItem"
        })
        .state('rejectOrderItemView', {
            url: '/rejectOrderItemView/:order_id/:supplie_id',
            templateUrl: 'templates/rejectOrderItemView.html',
            controller: "RejectOrderItem",
            cache: false
        })
        .state('tabs.reject', {
            url: '/reject',
            views: {
                'reject-tab': {
                    templateUrl: 'templates/reject.html',
                    controller: "RejectOrder"
                }
            }

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
