/**
 * @fileoverview
 */
goog.require('jamout.controllers.ProfileViewController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.controllers.ContactsCreateController');
goog.require("jamout.controllers.ContactsAcceptController");
goog.require('jamout.templates.ProfileView');
goog.require('jamout.templates.Header');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.ProfileViewService');
goog.require('jamout.services.LoginoutService');
goog.require('jamout.services.ContactsService');
goog.require('jamout.services.TokenInterceptor');

var templates = {
    'profileView.soy' : jamout.templates.ProfileView.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('profileView', [])
    .controller('profileViewCtrl', jamout.controllers.ProfileViewController.INJECTS)
    .controller('contactsCreateCtrl', jamout.controllers.ContactsCreateController.INJECTS)
    .controller('contactsAcceptCtrl', jamout.controllers.ContactsAcceptController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('profileViewService', jamout.services.ProfileViewService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .service('contactsService', jamout.services.ContactsService.INJECTS)
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

goog.exportSymbol('jamout.profileView.init', function() {
    angular.bootstrap(document, ['profileView']);
});

