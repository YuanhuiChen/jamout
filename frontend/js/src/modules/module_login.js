/**
 * @fileoverview
 */
goog.require('jamout.controllers.LoginController');
goog.require('jamout.templates.Login');
goog.require('jamout.services.LoginoutService');


var templates = {
    'login.soy' : jamout.templates.Login.frame()
};
angular.module('login', [])
    .controller('loginCtrl', jamout.controllers.LoginController.INJECTS)
    //Register service like this
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.login.init', function() {
    angular.bootstrap(document, ['login']);
});

