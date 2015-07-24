
var host = "http://101.200.188.188";
if(window.navigator.appVersion.indexOf('Mac') > -1){
    host = "http://m.eanet.local.wanda.cn";
}
// document.addEventListener("deviceready", onDeviceReady, false);
angular.module('ionicApp', ['ionic', 'ngResource', 'storeAppFilters'])
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
	if(window.plugins && typeof device !== undefined){
		alert('plugins');
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

        });


        $urlRouterProvider.otherwise('/sign-in');

})

.controller('BaseCtrl', function($rootScope, $http, $scope, $state) {
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
            alert('登录失败');
        }

    }, function(err) {
        console.log(err);
    });

})


.controller('SignInCtrl', function($rootScope, $http, $scope, $state) {

    $scope.signIn = function(user) {

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
                alert('登录失败');
            }

        }, function(err) {
            console.log(err);
        });

    };

})

.controller('mainCtrl', function($http, $scope, $state) {

        $scope.logout = function(user) {
            $state.go('tabs.signin');
            $http.post(host + '/api/user/logout').then(function(res) {
                $state.go('tabs.signin');
            }, function(err) {
                console.log(err);
            });
        };

    })
    .factory('marketList', function($resource) {
        var params = {};
        params.page = 1;
        params.count = 12;
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
            return $resource(host + '/api/order/order/:id', {"id":"@id"}, {
                query: {
                    method: "GET",
                    params: params
                },
                delete: {
                    method: "delete",
                    params: {id:id}
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
            return $resource(host + '/api/order/order/:id', {"id":"@id"}, {
                query: {
                    method: "GET",
                    params: params
                },
                delete: {
                    method: "delete",
                    params: {id:id}
                }
            })
        }
        return {
            getList: getList,
            params: params
        }
    })
    .factory('RejectOrderService', function($resource) {
        var params = {};
        params.page = 1;
        params.count = 10;
        //params.type = 2;
        params.type = "supplie_id";
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
      function($resource){
        return $resource('api/category/category', {id:'@id',search:'@search'}, {
          query: {method:'GET', params:{}, isArray:false},
          //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
          getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
          save: {method:'POST', isArray:false},
          update:{method:"PUT", isArray:false},
          delete: {method: "DELETE", params: {id:'@id'}}
        });
      }
    ])
    .controller('HomeTabCtrl', function(CategoryService, $ionicModal,$rootScope,marketList, $scope, $timeout) {
        $rootScope.host = host;
        $scope.noMoreItemsAvailable = false;
        console.log(marketList);
        $scope.items = [];
        var myNavs = [];
        $scope.navs = "不限";
        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
        $scope.loadMore = function() {
            $timeout(function() {
                marketList.getList().query(function(res) {
                    $scope.items = $scope.items.concat(res.result);
                    if (res.result.length < marketList.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    marketList.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

        };
        marketList.getList().query(function(res) {
            // console.log(res);
            $scope.items = $scope.items.concat(res.result);
            console.log($scope.items);
            if (res.result.length < marketList.params.count) {
                $scope.noMoreItemsAvailable = true;
            } else {
                $scope.noMoreItemsAvailable = false;
            }
            marketList.params.page++;
        });
        $scope.doRefresh =function(){
            $timeout(function() {
                marketList.params.page = 1;
                if($scope.catid > -1){
                    marketList.params.catid = $scope.catid;
                }else{
                    delete marketList.params.catid;
                }
                marketList.getList().query(function(res) {
                    $scope.items = res.result;
                    if (res.result.length < marketList.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    marketList.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);
            $scope.$broadcast('scroll.refreshComplete');
        };
        $scope.filterData = {
            category_0: -1,
            category_1: -1,
            category_2: -1,
        };

        $scope.catid = -1;
        $scope.categories_0 = [{id:-1,name:'不限'}];
        $scope.categories_1 = [{id:-1,name:'不限'}];
        $scope.categories_2 = [{id:-1,name:'不限'}];
        $scope.categories = CategoryService.query();
        $scope.$watch('filterData', function(){
            myNavs = [];
            console.log(myNavs);
            console.log($scope.categories);
            if($scope.categories && $scope.categories.data)
            $scope.categories.data.forEach(function(cat){
                console.log('cat',cat, $scope.filterData.category_0);
                if(cat.id == $scope.filterData.category_0){
                    if(cat.id !== -1){
                        myNavs.push(cat.name);
                        if(cat.children){
                            cat.children.forEach(function(subcat){
                                if(subcat.id == $scope.filterData.category_1){
                                    if(subcat.id != -1){
                                        myNavs.push(subcat.name);
                                        if(subcat.children){
                                            subcat.children.forEach(function(subcat2){
                                                if(subcat2.id == $scope.filterData.category_2){
                                                    if(subcat2.id != -1){
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
        $scope.changeCat = function(level, id){
            switch(level){
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
            if($scope.filterData.category_2 > -1){
                $scope.catid = $scope.filterData.category_2;
            }else if($scope.filterData.category_1 > -1){
                $scope.catid = $scope.filterData.category_1;
            }else if($scope.filterData.category_0 > -1){
                $scope.catid = $scope.filterData.category_0;
            }
            // $scope.catid = $scope.filterData.category_2 || $scope.filterData.category_1 || $scope.filterData.category_0;
            console.log($scope.catid);
            $scope.doRefresh();
        }
        $scope.$watch('filterData.category_0', function(){
            $scope.filterData.category_1 = -1;
            $scope.filterData.category_2 = -1;
            if(parseInt($scope.filterData.category_0) === -1){
                $scope.categories_1 = [{id:-1,name:'不限'}];
                $scope.categories_2 = [{id:-1,name:'不限'}];

            }else{
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories.data && $scope.categories.data.forEach(function(item){
                    if(item.id === parseInt($scope.filterData.category_0)){
                        console.log(item.children);
                        $scope.categories_1 = [{id:-1,name:'不限'}].concat(item.children);

                    }
                });
            }
        });

        $scope.$watch('filterData.category_1', function(){
            $scope.filterData.category_2 = -1;
            if(parseInt($scope.filterData.category_1) === -1){
                $scope.categories_2 = [{id:-1,name:'不限'}];

            }else{
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories_1 && $scope.categories_1.forEach(function(item){
                    if(item.id === parseInt($scope.filterData.category_1)){
                        console.log(item.children);
                        $scope.categories_2 = [{id:-1,name:'不限'}].concat(item.children);
                    }
                });
            }
        });
    })
    .controller('OrderList', function(OrderService, $rootScope, $scope, $timeout, $state, $http) {
        $scope.noMoreItemsAvailable = false;
        console.log(OrderService);
        $scope.showHistory = window.location.hash === "#/tab/history" ? 1 : 0;
        $scope.items = [];
        $scope.active = OrderService.params.ordertype;
        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
        OrderService.params.showHistory = $scope.showHistory;
        OrderService.params.page = 1;
        if($rootScope.user.role_type == 1){
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
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

        };
        $scope.doRefresh =function(){
            $timeout(function() {
                OrderService.params.page = 1;
                OrderService.getList().query(function(res) {
                    $scope.items = res.result;
                    if (res.result.length < OrderService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    OrderService.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);
            $scope.$broadcast('scroll.refreshComplete');
        }
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
        $scope.goto = function(order_id, supplie_id, order_status){
            $state.go('vieworder', {
                order_id: order_id,
                supplie_id: supplie_id,
                order_status: order_status
            });
        };
        $scope.del = function(id){
            var order = new OrderService.getList(id);
            order.delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                $scope.doRefresh();
                // window.location.reload();
            })
        }
        $scope.submitOrder = function(order_id){
            $http.post(host + '/api/order/orderSubmit',{order_id: order_id}).success(function(ret){
                if(ret.status == 500){
                    alert(ret.err || ret.msg);
                }else if(ret.status == 200){
                    alert('提交订单成功');
                    // window.location.reload();
                    $scope.doRefresh();
                }
            });
        }
        $scope.gotoReject = function(order_id, supplie_id){
            $state.go('rejectOrderItem',{order_id: order_id, supplie_id: supplie_id});
            // $scope.items = [];
        }
    })
    .controller('HistoryOrderList', function(HistoryOrderService,$rootScope, $scope, $timeout, $state, $http) {

        $scope.noMoreItemsAvailable = false;
        console.log(HistoryOrderService);
        $scope.showHistory = window.location.hash === "#/tab/history" ? 1 : 0;
        $scope.items = [];
        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
        HistoryOrderService.params.showHistory = $scope.showHistory;
        HistoryOrderService.params.ordertype = 1;
        HistoryOrderService.params.page = 1;
        if($rootScope.user.role_type == 1){
            HistoryOrderService.params.type = 2;
        }
        $scope.loadMore = function() {
            $timeout(function() {
                HistoryOrderService.getList().query(function(res) {
                    $scope.items = $scope.items.concat(res.result);
                    if (res.result.length < HistoryOrderService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    HistoryOrderService.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);

        };

        $scope.doRefresh =function(){
            $timeout(function() {
                HistoryOrderService.params.page = 1;
                HistoryOrderService.getList().query(function(res) {
                    $scope.items = res.result;
                    if (res.result.length < HistoryOrderService.params.count) {
                        $scope.noMoreItemsAvailable = true;
                    } else {
                        $scope.noMoreItemsAvailable = false;
                    }
                    HistoryOrderService.params.page++;
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 1000);
            $scope.$broadcast('scroll.refreshComplete');
        }

        HistoryOrderService.getList().query(function(res) {
            // console.log(res);
            $scope.items = $scope.items.concat(res.result);
            console.log($scope.items);
            if (res.result.length < HistoryOrderService.params.count) {
                $scope.noMoreItemsAvailable = true;
            } else {
                $scope.noMoreItemsAvailable = false;
            }
            HistoryOrderService.params.page++;
        });
        $scope.goto = function(order_id, supplie_id, order_status){
            $state.go('vieworder', {
                order_id: order_id,
                supplie_id: supplie_id,
                order_status: order_status
            });
        };
        $scope.del = function(id){
            var order = new HistoryOrderService.getList(id);
            order.delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                $scope.doRefresh();
            })
        }
        $scope.submitOrder = function(order_id){
            $http.post(host+'/api/order/orderSubmit',{order_id: order_id}).success(function(ret){
                if(ret.status == 500){
                    alert(ret.err || ret.msg);
                }else if(ret.status == 200){
                    alert('提交订单成功');
                    $scope.doRefresh();
                }
            });
        }
        $scope.gotoReject = function(order_id, supplie_id){
            $state.go('rejectOrderItem',{order_id: order_id, supplie_id: supplie_id});
            // $scope.items = [];
        }
    })
    .controller('RejectOrder', function(RejectOrderService,$state, $stateParams, $scope, $timeout) {
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
        $scope.doRefresh =function(){
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
        $scope.gotoRejectView = function(order_id){
            $state.go('rejectOrderItemView',{
                order_id: order_id
            })
        }
    })
    .controller('RejectOrderItem', function($ionicHistory, $scope,$timeout, $stateParams, $http, RejectOrderItemService){
        var orderid = $scope.orderid = $stateParams.order_id;
        $scope.companyid = $stateParams.supplie_id;
        $scope.processForm = function(){
            var oid = [],good_reject = [];
            $scope.formData.forEach(function(item){
                oid.push(item.oid);
                good_reject.push(item.good_reject);
            });

            $http.post(host+ '/api/order/rejectItems', {orderid:$scope.orderid,good_reject:good_reject.join("|"),oid:oid.join("|")}).success(function(ret){
                if(ret.status == 200){
                    alert('拒收成功，请等待确认');
                    window.history.back();
                }else{
                    alert('拒收失败，请刷新页面重试');
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
            res.result.forEach(function(item, index){
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
        $scope.goBack = function(){
            $ionicHistory.goBack();
        };

    })
    .controller('ViewOrder', function($scope, $timeout, $stateParams, $ionicHistory, OrderDetailService) {

        var order_id = $scope.order_id = $stateParams.order_id;
        $scope.supplie_id = $stateParams.supplie_id;
        $scope.order_status = $stateParams.order_status;
        OrderDetailService.params.page = 1;
        $scope.goBack = function(){
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

;
