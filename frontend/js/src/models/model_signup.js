/**
 * @fileoverview
 */

goog.provide('jamout.models.Signup');


/**
 * @constructor
 */
jamout.models.Signup = function() {

    /**
     * @expose
     * @type {string}
     */
    this.email = '';

    /**
     * @expose
     * @type {string}
     */
    this.username = '';

    /**
     * @expose
     * @type {string}
     */
    this.about = '';

    /**
     * @expose
     * @type {string}
     */
    this.location = '';

    /**
     * @expose
     * @type {string}
     */
    this.url = '';

    /**
     * @expose
     * @type {string}
     */
    this.password = '';

    /**
     * @expose
     * @type {string}
     */
    this.passwordConfirmation = '';
};

