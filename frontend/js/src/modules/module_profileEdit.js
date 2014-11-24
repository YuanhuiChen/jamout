/**
 * @fileoverview
 */
goog.require('jamout.controllers.ProfileEditController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.templates.ProfileEdit');
goog.require('jamout.templates.Header');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.ProfileEditService');
goog.require('jamout.services.LoginoutService');

var templates = {
    'profileEdit.soy' : jamout.templates.ProfileEdit.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('profileEdit', [])
    .controller('profileEditCtrl', jamout.controllers.ProfileEditController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('profileEditService', jamout.services.ProfileEditService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .config(['$httpProvider', function ($httpProvider) {        
         
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

goog.exportSymbol('jamout.profileEdit.init', function() {
    angular.bootstrap(document, ['profileEdit']);
});

