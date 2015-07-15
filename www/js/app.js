var host = "http://m.eanet.local.wanda.cn";
var host = "http://10.1.171.68";
angular.module('ionicApp', ['ionic', 'ngResource', 'storeAppFilters'])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('signin', {
            url: '/sign-in',
            templateUrl: 'templates/sign-in.html',
            controller: 'SignInCtrl'
        })
        .state('vieworder', {
            url: '/vieworder/:order_id/:supplie_id/:order_status',
            templateUrl: 'templates/vieworder.html',
            controller: 'ViewOrder'
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

        .state('tabs.reject', {
            url: '/reject',
            views: {
                'reject-tab': {
                    templateUrl: 'templates/reject.html',
                    controller: "RejectOrder"
                }
            }

        });

    //$urlRouterProvider.otherwise('/sign-in');

})

.controller('SignInCtrl', function($http, $scope, $state) {

    $scope.signIn = function(user) {

        $http.post(host + '/api/user/login', user).then(function(res) {
            console.log(res);
            if (res.data.status === 200) {
                if (/^1[0-9]{5}$/.test(res.data.comp_id)) {
                    $state.go('tabs.home');
                } else {
                    alert('登录失败，非药店账号');
                }

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
        params.ordertype = 0;
        //params.hasMore = true;
        function getList() {
            return $resource(host + '/api/order/order', {}, {
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
    .controller('HomeTabCtrl', function(marketList, $scope, $timeout) {
        $scope.noMoreItemsAvailable = false;
        console.log(marketList);
        $scope.items = [];
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
        // $scope.items = [];
    })
    .controller('OrderList', function(OrderService, $scope, $timeout, $state) {
        $scope.noMoreItemsAvailable = false;
        console.log(OrderService);
        $scope.items = [];
        //var url = "/api/items/market?page='+$scope.page+"&count="+$scope.count";
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
            // $scope.items = [];
    })
    .controller('RejectOrder', function(RejectOrderService, $scope, $timeout) {
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