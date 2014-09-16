/**
 * @fileoverview
 */
goog.require('jamout.controllers.ProfileController');
goog.require('jamout.templates.Profile');
goog.require('jamout.templates.Header');

var templates = {
    'profile.soy' : jamout.templates.Profile.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('profile', [])
    .controller('profileCtrl', jamout.controllers.ProfileController.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.profile.init', function() {
    angular.bootstrap(document, ['profile']);
});

