/**
 * @fileoverview
 */
goog.require('jamout.controllers.ContactsController');
goog.require('jamout.controllers.ContactsCreateController');
goog.require('jamout.controllers.ContactsSearchController');
goog.require("jamout.controllers.ContactsAcceptController");
goog.require('jamout.controllers.ContactsPendingController');
goog.require('jamout.controllers.ContactsStatsController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.services.ContactsService');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.LoginoutService');
goog.require('jamout.templates.Contacts');
goog.require('jamout.templates.ContactsSearch');
goog.require('jamout.templates.ContactsAdd');
goog.require('jamout.templates.ContactsPending');
goog.require('jamout.templates.Header');
goog.require('jamout.services.TokenInterceptor');

var templates = {
    'contacts.soy' : jamout.templates.Contacts.frame(),
    'contactsSearch.soy' : jamout.templates.ContactsSearch.frame(),
    'contactsAdd.soy' : jamout.templates.ContactsAdd.frame(),
    'contactsPending.soy' : jamout.templates.ContactsPending.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('contacts', [])
    .controller('contactsCtrl', jamout.controllers.ContactsController.INJECTS)
    .controller('contactsCreateCtrl', jamout.controllers.ContactsCreateController.INJECTS)
    .controller('contactsAcceptCtrl', jamout.controllers.ContactsAcceptController.INJECTS)
    .controller('contactsSearchCtrl', jamout.controllers.ContactsSearchController.INJECTS)
    .controller('contactsPendingCtrl', jamout.controllers.ContactsPendingController.INJECTS)
    .controller('contactsStatsCtrl', jamout.controllers.ContactsStatsController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('contactsService', jamout.services.ContactsService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .factory('tokenInterceptor', jamout.services.TokenInterceptor.INJECTS)
    .config(['$interpolateProvider', function ($interpolateProvider) {        
          //ovveride curly braces to avoid conflict with soy template 
           $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }]) 
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
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.contacts.init', function() {
    angular.bootstrap(document, ['contacts']);
});

