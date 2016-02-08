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
* @param {Object} contactCreateModel Contact Model 
*/
jamout.services.ContactsService.prototype.CreateContact = function(contactCreateModel){
     console.log('Contact Create Model', contactCreateModel);
     return this.http_.post(jamout.services.ContactsService.CREATE_CONTACT_URL, contactCreateModel, 
     	{
    	/**@const */	
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }     
    });
}	

/**
* @expose
*/
jamout.services.ContactsService.prototype.GetPendingContacts = function(){
     return this.http_.get(jamout.services.ContactsService.PENDING_CONTACT_URL);
}   

/**
*@expose
*@param (Object) 
*/
jamout.services.ContactsService.prototype.AcceptPendingContact = function(contactsPendingModel) {
    console.log('pending contacts', contactsPendingModel);
    return this.http_.post(jamout.services.ContactsService.ACCEPT_CONTACT_URL, contactsPendingModel);
}



/** @const */
jamout.services.ContactsService.CREATE_CONTACT_URL = '/api/contact/create';
/** @const */
jamout.services.ContactsService.PENDING_CONTACT_URL = '/api/contact/pending/get';
/** @const */
jamout.services.ContactsService.ACCEPT_CONTACT_URL = '/api/contact/accept';

jamout.services.ContactsService.INJECTS = ['$http', '$window', jamout.services.ContactsService];
