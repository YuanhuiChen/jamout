/**
* Model to collect password reset information
* @fileoverview
*/
goog.provide('jamout.models.ResetPassword');

/**
* Collect user input for password & password confirmation 
* @constructor
*/
jamout.models.ResetPassword = function () {
	/** @expose **/
	this.password = "";

	/** @expose **/
	this.passwordConfirmation = "";

}