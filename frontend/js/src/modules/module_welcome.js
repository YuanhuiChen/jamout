/**
 * @fileoverview
 */
goog.require('jamout.controllers.WelcomeController');
goog.require('jamout.services.InviteOnlyService');
goog.require('jamout.templates.Welcome');

var templates = {
    'welcome.soy' : jamout.templates.Welcome.frame()
};
angular.module('welcome', [])
    .controller('WelcomeCtrl', jamout.controllers.WelcomeController.INJECTS)
    .service('inviteOnlyService', jamout.services.InviteOnlyService.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.welcome.init', function() {
    angular.bootstrap(document, ['welcome']);
});

