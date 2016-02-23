/**
* Contains the logic to check a contacts status
* @fileoverview
*/ 

/**
* Contacts Status Message
* @param stat
* @param msg
* @constructor
*/
var ContactSMessage = function(stat,msg) {
	/**
	* Status Code
	* @type {Number}
	*/
	this.status = stat || 0;
	/**
	* Message
	* @type {string}
	*/
	this.message = msg || "";
}
exports.ContactSMessage = ContactSMessage;

/**
* @type {}
*/
var CONTACT_STATUS = {
   IN_CONTACTS : { CODE: 0, STATUS: 'inContacts'},
   NO_CONNECTION : { CODE : 1, STATUS:'noConnection'},
   PENDING_REQUEST : { CODE: 2, STATUS :'pendingRequest'}
};
exports.CONTACT_STATUS = CONTACT_STATUS;




