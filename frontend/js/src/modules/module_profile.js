/**
 * @fileoverview
 */
goog.require('jamout.controllers.ProfileController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.templates.Profile');
goog.require('jamout.templates.Header');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.ProfileService');
goog.require('jamout.services.LoginoutService');

var templates = {
    'profile.soy' : jamout.templates.Profile.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('profile', [])
    .controller('profileCtrl', jamout.controllers.ProfileController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('profileService', jamout.services.ProfileService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.profile.init', function() {
    angular.bootstrap(document, ['profile']);
});

