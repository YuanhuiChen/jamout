/**
 * @fileoverview
 */

goog.provide('jamout.services.InviteOnlyService');
goog.require('jamout.models.InviteOnly');

/**
 * @param $window
 * @constructor
 */

jamout.services.InviteOnlyService= function($window)
{
     this.window_ = $window;
     /** @export */
     this.model_ = new jamout.models.InviteOnly();
}

/**
 *
 * @returns {Boolean}
 * @constructor
 */
jamout.services.InviteOnlyService.prototype.isUserVerified = function ()
{
    // return  this.window_.localStorage['isVerified'];
    return  JSON.parse( this.window_.localStorage.getItem('isVerified'));
}

/**
 * @param Model
 * @constructor
 */
jamout.services.InviteOnlyService.prototype.verifyStatus = function (Model)
{

  this.userInput = Model['userInput'];

  // this.window_.localStorage['isVerified']  = this.userInput === this.model_['secret'] ? true : false;
  /**
  * @type {Boolean}
  */
  var access  = this.userInput === this.model_['secret'] ? true : false;
  this.window_.localStorage.setItem('isVerified', JSON.stringify(access));
}




jamout.services.InviteOnlyService.INJECTS = ['$window', jamout.services.InviteOnlyService];