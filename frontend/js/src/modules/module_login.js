/**
 * @fileoverview
 */
goog.require('jamout.controllers.LoginController');
goog.require('jamout.templates.Login');
goog.require('jamout.services.LoginoutService');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.TokenInterceptor');


var templates = {
    'login.soy' : jamout.templates.Login.frame()
};

angular.module('login', [])
    .controller('loginCtrl', jamout.controllers.LoginController.INJECTS)
    //Register service like this
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .factory('tokenInterceptor', jamout.services.TokenInterceptor.INJECTS)
    .config(['$httpProvider', function ($httpProvider) {
          $httpProvider.interceptors.push(jamout.services.TokenInterceptor.INJECTS);
         
          console.log($httpProvider);

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
          console.log($httpProvider);

    }])
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.login.init', function() {
    angular.bootstrap(document, ['login']);
});

