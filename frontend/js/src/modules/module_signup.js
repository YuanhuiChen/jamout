/**
 * @fileoverview
 */
goog.require('jamout.controllers.SignupController');
goog.require('jamout.templates.Signup');

var templates = {
    'signup.soy' : jamout.templates.Signup.frame()
};
angular.module('signup', [])
    .controller('signupCtrl', jamout.controllers.SignupController.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.signup.init', function() {
    angular.bootstrap(document, ['signup']);
});

