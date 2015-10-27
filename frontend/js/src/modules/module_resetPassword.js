/**
 * @fileoverview
 */
goog.require('jamout.controllers.ResetPasswordController');
goog.require('jamout.services.ResetPasswordService');
goog.require('jamout.templates.ResetPassword');

var templates = {
    'resetpassword.soy' : jamout.templates.ResetPassword.frame()
};
angular.module('resetpassword', [])
    .controller('resetPasswordCtrl', jamout.controllers.ResetPasswordController.INJECTS)
    .service('resetPasswordService', jamout.services.ResetPasswordService.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.resetpassword.init', function() {
    angular.bootstrap(document, ['resetpassword']);
});

