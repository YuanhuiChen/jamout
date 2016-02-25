/**
 * @fileoverview
 */

goog.provide('jamout.models.ContactCreate');


/**
 * Used in making a contact create request
 * @constructor
 */
jamout.models.ContactCreate = function() {

   /**
    * Holds the user id of current user  
    * @expose
    * @type {String}
    */
    this.currentUserId= "";

    /**
     * Hold the id of other contact we want to add
     * @expose
     * @type {String}
     */
    this.contactAddId = "";

};
