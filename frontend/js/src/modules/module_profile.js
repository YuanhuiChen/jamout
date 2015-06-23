/**
 * @fileoverview
 */
goog.require('jamout.controllers.ProfileController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.controllers.RoomCreateController');
goog.require('jamout.templates.Profile');
goog.require('jamout.templates.Header');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.ProfileService');
goog.require('jamout.services.LoginoutService');
goog.require('jamout.services.RoomService');
goog.require('jamout.services.Socket');

var templates = {
    'profile.soy' : jamout.templates.Profile.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('profile', [])
    .controller('profileCtrl', jamout.controllers.ProfileController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .controller('roomCtrl', jamout.controllers.RoomCreateController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('profileService', jamout.services.ProfileService.INJECTS)
    .service('roomService', jamout.services.RoomService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .service('socket', jamout.services.Socket.INJECTS)
    .config(['$httpProvider', function ($httpProvider) {        
         //console.log($httpProvider);

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

goog.exportSymbol('jamout.profile.init', function() {
    angular.bootstrap(document, ['profile']);
});

