/**
 * @fileoverview
 */
goog.require('jamout.controllers.InviteOnlyController');
goog.require('jamout.controllers.RequestInviteController');
goog.require('jamout.services.InviteOnlyService');
goog.require('jamout.templates.InviteOnly');
goog.require('jamout.templates.requestInviteForm');

var templates = {
    'inviteonly.soy' : jamout.templates.InviteOnly.frame(),
    'requestInviteForm.soy' : jamout.templates.requestInviteForm.frame()
};
angular.module('inviteonly', [])
    .controller('InviteOnlyCtrl', jamout.controllers.InviteOnlyController.INJECTS)
    .controller('requestOnlyCtrl', jamout.controllers.RequestInviteController.INJECTS)
    .service('inviteOnlyService', jamout.services.InviteOnlyService.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.inviteonly.init', function() {
    angular.bootstrap(document, ['inviteonly']);
});

