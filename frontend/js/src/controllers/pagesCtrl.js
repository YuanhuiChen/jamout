/**
 * To add logic to the miscellaneous pages: about, faq, terms, privacy
 * todo closure optimization
 * @fileoverview
 */

goog.provide('jamout.controllers.PagesController');

/**
 *
 * @param $scope
 * @param $window
 * @constructor
 */
jamout.controllers.PagesController = function($scope, $window) {
     /**
     * Todo: the footer sits on top of the about about text. fix it and then uncomment this
     * About page
     */ 
     $window.onload = function () {
    	 var CUBE = new jamoutTHREEJS();
     	CUBE.init();
    }



}

jamout.controllers.PagesController.INJECTS = ['$scope', '$window', jamout.controllers.PagesController];


