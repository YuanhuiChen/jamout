/**
 * Miscellaneous static pages for about, faq, privacy etc.
 * @fileoverview
 */
 goog.require('jamout.templates.AboutPage');
 goog.require('jamout.controllers.PagesController');
 goog.require('jamout.templates.WelcomeHeader');

var templates = {
    'about.soy' : jamout.templates.AboutPage.frame(),
    'welcomeHeader.soy' : jamout.templates.WelcomeHeader.frame()
};
angular.module('pages', [])
    .controller('pagesCtrl', jamout.controllers.PagesController.INJECTS)
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.pages.init', function() {
    angular.bootstrap(document, ['pages']);
});

