/**
 * @fileoverview
 */
goog.require('jamout.controllers.ProfileViewController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.templates.ProfileView');
goog.require('jamout.templates.Header');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.ProfileViewService');
goog.require('jamout.services.LoginoutService');

var templates = {
    'profileView.soy' : jamout.templates.ProfileView.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('profileView', [])
    .controller('profileViewCtrl', jamout.controllers.ProfileViewController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('profileViewService', jamout.services.ProfileViewService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
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

