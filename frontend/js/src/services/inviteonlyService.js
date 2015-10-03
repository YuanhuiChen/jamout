/**
 * @fileoverview
 */

goog.provide('jamout.services.InviteOnlyService');
goog.require('jamout.models.InviteOnly');

/**
 * @param $http
 * @param $window
 * @constructor
 */

jamout.services.InviteOnlyService= function($http, $window)
{
     /** @export */
     this.http_ = $http;
     /** @export */
     this.window_ = $window;
     /** @export */
     this.model_ = new jamout.models.InviteOnly();
}

/** @const */
jamout.services.InviteOnlyService.REQUESTINVITE_URL = '/api/requestinvite';

/**
 * @param inviteModel
 * @returns {angular.$http.HttpPromise}
 */
jamout.services.InviteOnlyService.prototype.updateGuestList = function (inviteModel)
{
   
    return this.http_.post(jamout.services.InviteOnlyService.REQUESTINVITE_URL, inviteModel, 
        {

        /**@const */    
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        /**@const */
        transformRequest: function(obj) 
        {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
        
    });
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

  this.userInput = angular.lowercase(Model['userInput']);

  /**
  * @type {Boolean}
  */
  var access  = this.userInput === this.model_['secret'] ? true : false;
  this.window_.localStorage.setItem('isVerified', JSON.stringify(access));
}




jamout.services.InviteOnlyService.INJECTS = ['$http', '$window', jamout.services.InviteOnlyService];