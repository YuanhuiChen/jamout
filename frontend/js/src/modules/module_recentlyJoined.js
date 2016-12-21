/**
 * @fileoverview
 */
goog.require('jamout.controllers.RecentlyJoinedController');
goog.require('jamout.services.RecentlyJoinedService');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.templates.recentlyJoined'); 
goog.require('jamout.templates.Header');
goog.require('jamout.services.TokenInterceptor');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.LoginoutService');

var templates = {
    'recentlyJoined.soy' : jamout.templates.recentlyJoined.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('recentlyJoined', [])
    .controller('recentlyJoinedCtrl', jamout.controllers.RecentlyJoinedController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('recentlyJoinedService', jamout.services.RecentlyJoinedService.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .factory('tokenInterceptor', jamout.services.TokenInterceptor.INJECTS)
    .config(['$httpProvider', function ($httpProvider) {        
         //console.log($httpProvider);
            $httpProvider.interceptors.push(jamout.services.TokenInterceptor.INJECTS);
           // Use x-www-form-urlencoded Content-Type
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */ 
            var param = function(obj) {
              var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

              for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                  for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                  }
                }
                else if(value instanceof Object) {
                  for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                  }
                }
                else if(value !== undefined && value !== null)
                  query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
              }

              return query.length ? query.substr(0, query.length - 1) : query;
            };

            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function(data) {
              return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
            }];

    }])
    .config(['$interpolateProvider', function ($interpolateProvider) {        
              //ovveride curly braces to avoid conflict with soy template 
               $interpolateProvider.startSymbol('[[').endSymbol(']]');
        }]) 
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.recentlyJoined.init', function() {
    angular.bootstrap(document, ['recentlyJoined']);
});

