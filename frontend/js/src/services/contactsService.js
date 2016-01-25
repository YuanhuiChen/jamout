/**
* Todo change to contacts to relationship
* Helper functions for the Contacts Controller
* @fileoverview
*/
goog.provide('jamout.services.ContactsService');

/**
 * @param $http
 * @constructor
 */

jamout.services.ContactsService = function( $http, $window)
{
    /** @expose */
    this.http_ = $http;

    /** @expose */
    this.window_ = $window;
}

/**
* @expose
* @param {Object} contactCreateModel Contact Model with the follower / following data
*/
jamout.services.ContactsService.prototype.CreateContact = function(contactCreateModel){
     console.log('Contact Create Model', contactCreateModel);
     return this.http_.post(jamout.services.ContactsService.CREATE_RELATIONSHIP_URL, contactCreateModel, 
     	{
    	/**@const */	
        headers: 
        {
            'Authorization': 'Bearer ' + this.window_.localStorage['token'],
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }     
    });
}	


/** @const */
jamout.services.ContactsService.CREATE_RELATIONSHIP_URL = '/api/relationship/create';

jamout.services.ContactsService.INJECTS = ['$http', '$window', jamout.services.ContactsService];
