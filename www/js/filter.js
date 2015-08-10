'use strict';

/* Filters */

var storeAppFilters = angular.module("storeAppFilters",[]);

storeAppFilters.filter('boole',function(){
  return function(input){
      return input=="true"||input==1?1:0;
  };
});

storeAppFilters.filter('isMenuCn', function() {
  return function(input) {
    return input=="true"||input==1?"显示为菜单":"";
  };
});

storeAppFilters.filter('roleTypeToCN', function() {
  return function(input) {
    return input == 0 ? "超级管理员":(input == 1?"批发企业":"药店零售商");
  };
});

storeAppFilters.filter('toInt', function() {
  return function(input) {
    return parseInt(input).toFixed(2);
  };
});

storeAppFilters.filter('rejectFilter', function() {
  return function(input) {
    var ret="等待确认";
    switch(input){
      case 1:
        ret = "等待确认";
        break;
      case 2:
        ret = "已确认";
        break;
    }
    return ret;
  };
});
storeAppFilters.filter('filterDate', function() {
  return function(input) {
    return input.split('T')[0];
  };
});

storeAppFilters.filter('userStateCN', function() {
  return function(input) {
  	var ret="正常";
  	switch(input){
  		case 0:
  			ret = "正常";
  			break;
  		case 1:
  			ret = "停用";
  			break;
  	}
  	return ret;
  };
});

storeAppFilters.filter('companyType', function() {
  return function(input) {
  	var ret="药店";
  	switch(input){
  		case 1:
  			ret = "药店";
  			break;
  		case 2:
  			ret = "批发企业";
  			break;
  	}
  	return ret;
  };
});

storeAppFilters.filter('orderStatusFilter', function() {
  return function(input) {
    var ret="待处理";
    switch(input){
      case 1:
        ret = "待处理";
        break;
      case 2:
        ret = "药店提交";
        break;
      case 3:
        ret = "已报价";
        break;
      case 4:
        ret = "已发货";
        break;
      case 5:
        ret = "已完成";
        break;
      case 6:
        ret = "已导出";
        break;
      case 7:
        ret = "待报价";
        break;
      case 8:
        ret = "已确认";
        break;
    }
    return ret;
  };
});

storeAppFilters.filter('orderTypeFilter', function() {
  return function(input) {
    var ret="直接订单";
    switch(input){
      case 1:
        ret = "直接订单";
        break;
      case 2:
        ret = "询价订单";
        break;
    }
    return ret;
  };
});


