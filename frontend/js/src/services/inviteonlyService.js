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
     /** @expose */
     this.http_ = $http;
     /** @expose */
     this.window_ = $window;
     /** @expose */
     this.model_ = new jamout.models.InviteOnly();

    /** 
     * @expose
     * @type {String}
     */
    this.secret = ['pizza', 'babycastles', 'chiptune', 'nxc'];

  
}

jamout.services.InviteOnlyService.prototype.getSecret = function () {
  return this.secret;
}


/** @const */
jamout.services.InviteOnlyService.REQUESTINVITE_URL = '/api/requestinvite';

/**
 * @expose
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
 * @export 
 * @returns {Boolean}
 * @constructor
 */
jamout.services.InviteOnlyService.prototype.isUserVerified = function ()
{
    // return  this.window_.localStorage['isVerified'];
    return  JSON.parse( this.window_.localStorage.getItem('isVerified'));
}

/**
 * @param {*} Model
 * @expose
 * @constructor
 */
jamout.services.InviteOnlyService.prototype.verifyStatus = function (Model)
{
  this.userInput = angular.lowercase(Model['userInput']);
  /**
  * @type {Boolean}
  */

  /** @const **/
  var secret = this.getSecret();
  /** @const **/
  var paramLength = secret.length;

  for (var i =0; i < paramLength; i++) {
       /** @type {Boolean} **/
       var access =  this.userInput === secret[i] ? true : false; 

       if (access) {
         return  this.window_.localStorage.setItem('isVerified', JSON.stringify(access));

       }
  }
}




jamout.services.InviteOnlyService.INJECTS = ['$http', '$window', jamout.services.InviteOnlyService];