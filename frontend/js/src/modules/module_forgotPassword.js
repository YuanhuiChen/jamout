/**
 * @fileoverview
 */
goog.require('jamout.controllers.ForgotPasswordController');
goog.require('jamout.services.ForgotPasswordService');
goog.require('jamout.templates.ForgotPassword');

var templates = {
    'forgotpassword.soy' : jamout.templates.ForgotPassword.frame()
};
angular.module('forgotpassword', [])
    .controller('forgotPasswordCtrl', jamout.controllers.ForgotPasswordController.INJECTS)
    .service('forgotPasswordService', jamout.services.ForgotPasswordService.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.forgotpassword.init', function() {
    angular.bootstrap(document, ['forgotpassword']);
});

