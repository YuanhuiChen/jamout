/**
 * @fileoverview
 */

goog.provide('jamout.models.InviteOnly');


/**
 * @constructor
 */
jamout.models.InviteOnly = function() {

     /**
     * @expose
     * @type {string}
     */
    this.email = "";

    /**
     * @expose
     * @type {string}
     */
    this.userInput = "";

    /**
     * @expose
     * @type {string}
     */
    this.secret = 'lit';
};

