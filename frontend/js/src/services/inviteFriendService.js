/**
 * @fileoverview
 */

goog.provide('jamout.services.InviteFriendService');

/**
* @param $window
* @param $http
* @constructor
*/
jamout.services.InviteFriendService = function ($window, $http) {

	/** @expose **/
	this.window_ = $window;


	/** @expose **/
	this.http_ = $http;

}

/**
* http request to invite friend
* @param {Object} model
*/
jamout.services.InviteFriendService.prototype.sendInvite = function (model) {
       
      return this.http_.post(jamout.services.InviteFriendService.SEND_INVITE_URL, model)
  }

/** @const */
jamout.services.InviteFriendService.SEND_INVITE_URL = '/api/invite/friend';


jamout.services.InviteFriendService.INJECTS = ['$window','$http', jamout.services.InviteFriendService];