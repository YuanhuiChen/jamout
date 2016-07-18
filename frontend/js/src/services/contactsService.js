/**
* Helper functions for the Contacts Controller
* @fileoverview
*/
goog.provide('jamout.services.ContactsService');

/**
 * @param $http
 * @param $rootScope 
 * @constructor
 */

jamout.services.ContactsService = function( $http, $rootScope)
{
    /** @expose */
    this.http_ = $http;

    /** @expose */
    jamout.services.ContactsService.scope_ = $rootScope;

    /** @expose */
    this.usersId = null;

    /** @expose */
    this.users = null;

    /**
     * Holds the success message to display on the page
     * Accessed via $scope
     * @type {String}
     */
    this.success = '';

    /**
     * Holds the error message to display on the page
     * Accessed via $scope
     * @type {String}
     */
    this.error = '';

    /**
     * Holds the connection type e.g. inContacts, noConnection % pendingRequest to display the type of btn
     * Accessed via $scope
     * @type {String}
     */
    this.connectionType = '';

    /**
     * Holds the btn label to diplay on the page
     * Accessed via $scope
     * @type {String}
     */
    this.btnlabel = '';
    /**
     * @type {String}
     * @expose
     */
    this.hoverInText = '';

    /**
     * @type {String}
     * @expose
     */
    this.hoverOutText = '';



};


/**
 * @param {String} hoverInText Text to display when a user hovers on a btn
 * @param {String} hoverOutText Text to display when a user hover away from the btn
 * @expose
 */
jamout.services.ContactsService.prototype.setBtnText = function(hoverInText, hoverOutText) {

     this.hoverOutText = hoverOutText;
     this.hoverInText = hoverInText;
     jamout.services.ContactsService.scope_.$broadcast('update:btnHoverInText', hoverInText);
     jamout.services.ContactsService.scope_.$broadcast('update:btnHoverOutText', hoverOutText);
     return;
};


/**
* @expose
* @param {Object} contactCreateModel Contact Model 
*/
jamout.services.ContactsService.prototype.CreateContact = function(contactCreateModel){
     // console.log('Contact Create Model', contactCreateModel);
     return this.http_.post(jamout.services.ContactsService.CREATE_CONTACT_URL, contactCreateModel, 
     	{
    	/**@const */	
        headers: 
        {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }     
    });
};	
/** @const */
jamout.services.ContactsService.CREATE_CONTACT_URL = '/api/contact/create';


/**
* Request to get current contacts
*/
jamout.services.ContactsService.prototype.GetContacts = function () {
    return this.http_.get(jamout.services.ContactsService.CONTACTS_URL);
};
/** @const */
jamout.services.ContactsService.CONTACTS_URL = '/api/contacts/get';

/**
* Request to get pending contacts
* @expose
*/
jamout.services.ContactsService.prototype.GetPendingContacts = function(){
     return this.http_.get(jamout.services.ContactsService.PENDING_CONTACT_URL);
};   
/** @const */
jamout.services.ContactsService.PENDING_CONTACT_URL = '/api/contact/pending/get';


/**
* Request to Accept Pending Contact
* @expose
* @param {Object} contactsPendingModel 
 */
jamout.services.ContactsService.prototype.AcceptPendingContact = function(contactsPendingModel) {
    // console.log('pending contacts', contactsPendingModel);
    return this.http_.post(jamout.services.ContactsService.ACCEPT_CONTACT_URL, contactsPendingModel);
};
/** @const */
jamout.services.ContactsService.ACCEPT_CONTACT_URL = '/api/contact/accept';

/**
 * Check the status of existing connection between two users e.g. inContacts, noConnection, pendingRequest
 * @param {Object} contacts The users who's connection we want to check
 * @expose
 */
jamout.services.ContactsService.prototype.checkContactStatus = function(contacts) {
     this.http_.post(jamout.services.ContactsService.VERIFY_CONTACT_URL, contacts)
     .success(function(res, status) {
       if (res["success"]) {
             // console.log('res success is', res["success"]);
             jamout.services.ContactsService.scope_.$broadcast('update:success', res["success"]);
          }

        if (typeof res["message"] === "string") {
            var msg = res["message"];
            // console.log('msg is', msg);
            var length = jamout.services.ContactsService.BTN_TYPES.length;
            // console.log('length is', length);
            this.connectionType = msg;
            jamout.services.ContactsService.scope_.$broadcast('update:connectionType', msg);
            
            for (var i = 0; i < length; i++) {
                    if (msg == jamout.services.ContactsService.BTN_TYPES[i].STATUS) {
                        if (!!!(msg == "inContacts")) {
                            // console.log('not inside contacts');
                            var onHoverText = jamout.services.ContactsService.BTN_TYPES[i].ON_HOVER_LABEL;
                            var onHoverOutText = jamout.services.ContactsService.BTN_TYPES[i].DEFAULT_LABEL;
                            // console.log('onHoverText is', onHoverText);
                            // console.log('onHoverOutText is', onHoverOutText);
                            jamout.services.ContactsService.prototype.setBtnText(onHoverText, onHoverOutText);
                            jamout.services.ContactsService.scope_.$broadcast('update:btnlabel', onHoverOutText);
                      } else {
                            // console.log('inside contacts');
                            // console.log('btn label is', jamout.services.ContactsService.BTN_TYPES[i].DEFAULT_LABEL);
                            jamout.services.ContactsService.scope_.$broadcast('update:success', jamout.services.ContactsService.BTN_TYPES[i].DEFAULT_LABEL);
                      }
                    }
                } 
        }
   })
   .error(function(res, status){
        // console.log('error res for verify', res);
        if (res["error"]) {
            this.error = res["error"];
            jamout.services.ContactsService.scope_.$broadcast('update:error', res["error"]);
      }
   });
};
/** @const */
jamout.services.ContactsService.VERIFY_CONTACT_URL = '/api/contact/verify';
/**
 * holds the different btn states and their respective hover texts
 * @type {Array}
 */
jamout.services.ContactsService.BTN_TYPES = [
    {STATUS: "inContacts", DEFAULT_LABEL: "User is in contacts", ON_HOVER_LABEL:"Visit contacts"}, 
    {STATUS: "noConnection", DEFAULT_LABEL: "Add contact", ON_HOVER_LABEL: "Send request"},
    {STATUS: "pendingRequest", DEFAULT_LABEL: "Accept contact request", ON_HOVER_LABEL: "Confirm"}
];


/**
 * Search for a contact 
 * @param {Object} searchContactModel The contact we want to search for
 * @expose
 */
jamout.services.ContactsService.prototype.searchContact = function (searchContactModel) {
  return  this.http_.post(jamout.services.ContactsService.SEARCH_CONTACT_URL, searchContactModel);
};
/**
 * API ENDPOINT to search for a contact
 * @type {String}
 * @const
 */
jamout.services.ContactsService.SEARCH_CONTACT_URL = '/api/contact/search';


/**
 * Get contact stats to display on the users profile e.g. total contacts / total pending contacts
 * @expose
 */
jamout.services.ContactsService.prototype.getContactStats = function () {
  return  this.http_.get(jamout.services.ContactsService.CONTACT_STATS_URL);
};
/**
 * API ENDPOINT for contact stats
 * @type {String}
 * @const
 */
jamout.services.ContactsService.CONTACT_STATS_URL = '/api/contact/stats';




jamout.services.ContactsService.INJECTS = ['$http', '$rootScope', jamout.services.ContactsService];
