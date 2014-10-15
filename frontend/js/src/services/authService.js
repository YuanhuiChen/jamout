/**
 * @fileoverview
 */

goog.provide('jamout.services.AuthService');

/**
 *
 * @constructor
 */

jamout.services.AuthService = function()
{
    /**
     * User Privileges Info, like whether user is admin
     * @type {null}
     */
    this.privileges = null;

    /**
     * Indicates whether user logged in
     * @type {boolean}
     */
    this.isLoggedIn = false;

}

/**
 *
 * @returns {AuthService.isLoggedIn.boolean}
 * @constructor
 */
jamout.services.AuthService.prototype.isUserLoggedIn = function()
{   
    return this.isLoggedIn;
}

jamout.services.AuthService.prototype.getUserPrivileges = function()
{
    return this.privileges;
}


jamout.services.AuthService.INJECTS = [jamout.services.AuthService];