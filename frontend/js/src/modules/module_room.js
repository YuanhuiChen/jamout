/**
 * @fileoverview
 */
goog.require('jamout.controllers.RoomController');
goog.require('jamout.templates.Room');
goog.require('jamout.templates.HeaderRoom');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.RoomService');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.services.LoginoutService');

var templates = {
    'room.soy' : jamout.templates.Room.frame(),
    'headerRoom.soy' : jamout.templates.HeaderRoom.frame()   
};
angular.module('room', [])
    .controller('roomCtrl', jamout.controllers.RoomController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('roomService', jamout.services.RoomService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
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

goog.exportSymbol('jamout.room.init', function() {
    angular.bootstrap(document, ['room']);
});

