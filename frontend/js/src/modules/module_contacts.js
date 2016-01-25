/**
 * @fileoverview
 */
goog.require('jamout.controllers.ContactsController');
goog.require('jamout.controllers.LogoutController');
goog.require('jamout.services.ContactsService');
goog.require('jamout.services.AuthService');
goog.require('jamout.services.LoginoutService');
goog.require('jamout.templates.Contacts');
goog.require('jamout.templates.ContactsAdd');
goog.require('jamout.templates.ContactsAccept');
goog.require('jamout.templates.Header');

var templates = {
    'contacts.soy' : jamout.templates.Contacts.frame(),
    'contactsAdd.soy' : jamout.templates.ContactsAdd.frame(),
    'contactsAccept.soy' : jamout.templates.ContactsAccept.frame(),
    'header.soy' : jamout.templates.Header.frame()
};
angular.module('contacts', [])
    .controller('contactsCtrl', jamout.controllers.ContactsController.INJECTS)
    .controller('logoutCtrl', jamout.controllers.LogoutController.INJECTS)
    .service('authService', jamout.services.AuthService.INJECTS)
    .service('contactsService', jamout.services.ContactsService.INJECTS)
    .service('loginoutService', jamout.services.LoginoutService.INJECTS)
    .config(['$interpolateProvider', function ($interpolateProvider) {        
          //ovveride curly braces to avoid conflict with soy template 
           $interpolateProvider.startSymbol('[[').endSymbol(']]');
    }]) 
    .run(['$templateCache', function($templateCache) {
        for (var templateUrl in templates) {
            $templateCache.put(templateUrl, templates[templateUrl]);
        }
    }]);

goog.exportSymbol('jamout.contacts.init', function() {
    angular.bootstrap(document, ['contacts']);
});

