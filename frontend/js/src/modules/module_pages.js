/**
 * Miscellaneous static pages for about, faq, privacy etc.
 * @fileoverview
 */
 goog.require('jamout.templates.AboutPage');
 goog.require('jamout.templates.FaqPage');
 goog.require('jamout.templates.TermsOfService');
 goog.require('jamout.templates.WelcomeHeader');
 goog.require('jamout.controllers.PagesController');

var templates = {
    'about.soy' : jamout.templates.AboutPage.frame(),
    'faq.soy' : jamout.templates.FaqPage.frame(),
    'termsOfService.soy' : jamout.templates.TermsOfService.frame(),
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

