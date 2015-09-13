/**
 * @fileoverview
 */
goog.require('jamout.controllers.InviteOnlyController');
goog.require('jamout.templates.InviteOnly');

var templates = {
    'inviteonly.soy' : jamout.templates.InviteOnly.frame()
};
angular.module('inviteonly', [])
    .controller('InviteOnlyCtrl', jamout.controllers.InviteOnlyController.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.inviteonly.init', function() {
    angular.bootstrap(document, ['inviteonly']);
});

