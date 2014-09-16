/**
 * @fileoverview
 */

goog.provide('jamout.services.AuthService');

jamout.services.AuthService = function()
{
    /**
     * User Privileges Info, like whether user is admin
     * @type {null}
     */
    this.previliges = null;

    /**
     * Indicates whether user logged in
     * @type {boolean}
     */
    this.isLoggedIn = false;

}


jamout.services.AuthService.prototype.isUserLoggedIn = function()
{
    return this.isLoggedIn;
}

jamout.services.AuthService.prototype.getUserPreviliges = function()
{
    return this.previliges;
}


jamout.services.AuthService.INJECTS = [jamout.services.AuthService];