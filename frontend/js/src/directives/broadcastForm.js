/**
* To provide Broadcast Form to  Profile
* @fileoverview
*/
goog.provide('jamout.directives.broadcastForm');
goog.require('jamout.templates.broadcastForm');

/**
* @constructor
*/
jamout.directives.broadcastForm = function () {
	return {
		template: jamout.templates.broadcastForm.frame()
	};
}

jamout.directives.broadcastForm.INJECTS = [jamout.directives.broadcastForm];