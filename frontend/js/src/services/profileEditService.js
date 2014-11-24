/**
 * @fileoverview
 */
 
goog.provide('jamout.services.ProfileEditService');
goog.require('jamout.models.ProfileEdit');


/**
 *
 * @param {angular.$http} $http
 * @param {angular.$window} $window
 * @constructor
 */

 jamout.services.ProfileEditService = function($http, $window)
{
	
    /** expose */
    this.$http_ = $http;

    /** expose */
    this.$window_ = $window;
}

/**
 * @returns {angular.$http.HttpPromise}
 * @constructor
 */
jamout.services.ProfileEditService.prototype.EditDetails = function(editModel)
{
   
    return this.$http_.put(jamout.services.ProfileEditService.PROFILE_URL, editModel,  
    	{
    	/**@const */	
        headers: 
        {
            'Authorization': 'Bearer ' + this.$window_.sessionStorage['token'],
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        
    });
}



//jamout.services.ProfileEditService.PROFILE_URL = '/api/profile/' + '5446562acf2b9b3c5071fae4';
jamout.services.ProfileEditService.PROFILE_URL = '/api/profile/edit';

jamout.services.ProfileEditService.INJECTS =  ['$http', '$window', jamout.services.ProfileEditService];