/**
 * @fileoverview
 */
goog.require('jamout.controllers.LoginController');
goog.require('jamout.templates.Login');

var templates = {
    'login.soy' : jamout.templates.Login.frame()
};
angular.module('login', [])
    .controller('loginCtrl', jamout.controllers.LoginController.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);


goog.exportSymbol('jamout.login.init', function() {
    angular.bootstrap(document, ['login']);
});

