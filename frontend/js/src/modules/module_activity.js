/**
 * @fileoverview
 */
goog.require('jamout.controllers.ActivityController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.templates.Activity');
goog.require('jamout.templates.ActivityFeed');
goog.require('jamout.templates.Header');
goog.require('jamout.services.ActivityService');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.LoginoutService');
goog.require('jamout.services.TokenInterceptor');
goog.require('jamout.directives.ActivityFeed');

var templates = {
    'activity.soy' : jamout.templates.Activity.frame(),
    'activityFeed.soy' : jamout.templates.ActivityFeed.frame(),
    'header.soy' : jamout.templates.Header.frame()
};

angular.module('activity', ['angularMoment'])
    .controller('activityCtrl', jamout.controllers.ActivityController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('activityService', jamout.services.ActivityService.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .directive('activityFeed', jamout.directives.ActivityFeed.INJECTS)
    .factory('tokenInterceptor', jamout.services.TokenInterceptor.INJECTS)
    .config(['$httpProvider', function ($httpProvider) {        
         $httpProvider.interceptors.push(jamout.services.TokenInterceptor.INJECTS); 
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

goog.exportSymbol('jamout.activity.init', function() {
    angular.bootstrap(document, ['activity']);
});

