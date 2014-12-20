/**
 * @fileoverview
 */
goog.require('jamout.controllers.RoomViewController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.templates.RoomView');
goog.require('jamout.templates.HeaderRoom');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.RoomViewService');
goog.require('jamout.services.LoginoutService');

var templates = {
    'roomView.soy' : jamout.templates.RoomView.frame(),
    'headerRoom.soy' : jamout.templates.HeaderRoom.frame() 
};
angular.module('roomView', [])
    .controller('roomViewCtrl', jamout.controllers.RoomViewController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('roomViewService', jamout.services.RoomViewService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.roomView.init', function() {
    angular.bootstrap(document, ['roomView']);
});

