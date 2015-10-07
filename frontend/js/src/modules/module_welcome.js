/**
 * @fileoverview
 */
goog.require('jamout.controllers.WelcomeController');
goog.require('jamout.services.InviteOnlyService');
// goog.require('jamout.services.AuthService');
// goog.require('jamout.services.TokenInterceptor');
goog.require('jamout.templates.Welcome');

var templates = {
    'welcome.soy' : jamout.templates.Welcome.frame()
};
angular.module('welcome', [])
    .controller('WelcomeCtrl', jamout.controllers.WelcomeController.INJECTS)
    .service('inviteOnlyService', jamout.services.InviteOnlyService.INJECTS)
    // .service('authService', jamout.services.AuthService.INJECTS)
    // .factory('tokenInterceptor', jamout.services.TokenInterceptor.INJECTS)
    // .config(['$httpProvider', function ($httpProvider) {
          
    //        $httpProvider.interceptors.push(jamout.services.TokenInterceptor.INJECTS);
      
    //        // Use x-www-form-urlencoded Content-Type
    //         $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    // }])
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.welcome.init', function() {
    angular.bootstrap(document, ['welcome']);
});

