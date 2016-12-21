/**
 * @fileoverview
 */
goog.require('jamout.controllers.AdminController');
goog.require('jamout.services.AdminService');
goog.require('jamout.templates.AdminPanel');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.TokenInterceptor');

var templates = {
    'adminPanel.soy' : jamout.templates.AdminPanel.frame()
};
angular.module('admin', [])
    .controller('adminCtrl', jamout.controllers.AdminController.INJECTS)
    .service('adminService', jamout.services.AdminService.INJECTS)
    //TODO fix auth /profile
    .service('authService', jamout.services.AuthService.INJECTS)
    .factory('tokenInterceptor', jamout.services.TokenInterceptor.INJECTS)
    .config(['$httpProvider', function ($httpProvider) {        
         $httpProvider.interceptors.push(jamout.services.TokenInterceptor.INJECTS); 
    }])
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.admin.init', function() {
    angular.bootstrap(document, ['admin']);
});

