/**
 * @fileoverview
 */
goog.provide('jamout.services.TokenInterceptor');




/**
 *
 * @param {angular.$q} $q
 * @param {angular.$window} $window
 * @param {jamout.services.authService} authService
 * @constructor
 */


jamout.services.TokenInterceptor = function ($q, $window, authService)
{
	return {

		/**
		* @expose
		* @param config
		*/
		request: function(config) {
			console.log('This is the config from interceptor');
			console.log(config);
			/**
			*@const
			*/
			var token;
			config.headers = config.headers || {};
			if ($window.sessionStorage['token']) {
				//token = angular.fromJson($window.sessionStorage['token']);
				/**
                 * Set token to actual data and headers. Note that we need both ways because 
                 * socket cannot modify headers anyway. These values are cleaned up in backend
                 * side policy (middleware).
                 */
                
				config.headers['Authorization'] = 'Bearer ' + $window.sessionStorage['token'];
				
				console.log(config);
				$window.location.href = '/profile';
			}
			return config;
		},

		/**
		* @expose
		* @param rejection
		*/
		requestError: function(rejection) {
			return $q.reject(rejection);
		},

		
		/**
		* set authService.isLoggedIn to true if 200 received
		* @expose
		* @param response
		*/
		response : function (response) {
			if (response != null && response.status == 200 && $window.sessionStorage.token && !authService.isLoggedIn) {
				authService.isLoggedIn = true;
		   }
			return response || $q.when(response);
		},

		/**
		* Revoke client authentication if 401 is received
		* @expose
		* @param rejection
		*/
		responseError: function(rejection) {
			if (rejection != null && rejection.status === 401 && ($window.sessionStorage['token'] || authService.isLoggedIn)) {
				delete $window.sessionStorage.token;
				authService.isLoggedIn = false;
				console.log('Rejection received. Redirect back to login. ')
				//$location.path("/login");
			}

			return $q.reject(rejection);
		}
	};
};

jamout.services.TokenInterceptor.INJECTS = ['$q', '$window', 'authService', jamout.services.TokenInterceptor];