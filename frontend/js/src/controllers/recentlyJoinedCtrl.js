/**
 * Shows the users that have recently joined
 * @fileoverview
 */

goog.provide('jamout.controllers.RecentlyJoinedController');

/**
 *
 * @param $scope
 * @param $window
 * @param {jamout.services.recentlyJoinedService} recentlyJoinedService
 * @constructor
 */
jamout.controllers.RecentlyJoinedController = function($scope, $window, recentlyJoinedService) {
     

     recentlyJoinedService.getUsers()
     .success(function(res, status, headers, config) {
						// $window.console.log('success', res);
						/** @expose **/
						$scope.error = "";

					if (res['success']) {
						recentlyJoinedService.users = res['success'];
						/** @expose **/
						$scope.users = recentlyJoinedService.users;
						}
					})
					.error(function(res, status, headers, config) {
						if (res) {
						    /** @expose **/
							$scope.error = res['error'];
						}
					})
}

jamout.controllers.RecentlyJoinedController.INJECTS = ['$scope', '$window', 'recentlyJoinedService', jamout.controllers.RecentlyJoinedController];


