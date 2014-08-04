goog.require('jamout.controllers.WelcomeController');
goog.require('jamout.templates.Welcome');
var templates = {
    'welcome.soy' : jamout.templates.Welcome.frame()
};
angular.module('welcome', [])
    .controller('WelcomeCtrl', jamout.controllers.WelcomeController.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

angular.bootstrap(document, ['welcome']);
