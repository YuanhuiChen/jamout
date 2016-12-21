/**
* To provide Contact Stats to  Profile
* @fileoverview
*/
goog.provide('jamout.directives.contactStats');
goog.require('jamout.templates.contactStats');

/**
* @constructor
*/
jamout.directives.contactStats = function () {
	return {
		template: jamout.templates.contactStats.frame()
	};
}

jamout.directives.contactStats.INJECTS = [jamout.directives.contactStats];