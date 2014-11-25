var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var basicAuth = require('basic-auth');
var https = require('https');
var fs = require('fs');

/** HTTP Server that can easily be configured with routes, authorization, ...
  * @constructor
  * @param {string} key - file path to SSL Key
  *	@param {string} cert - file path to SSL Certificate
  */
function HTTPSServer(key, cert, modules) {

	var app = express();
	var auth = undefined;
	var credentials = {};
	var context = {};

	/** initialise function for HTTPSServer-object
	  * @private
	  */
	function init() {

		// setup credentials for SSL (HTTPS)
		credentials.key = fs.readFileSync(key);
		credentials.cert = fs.readFileSync(cert);

		// configure modules
		for(var i = 0; i < modules.length; ++i) {
			app.use(modules[i]);
		}

		/** @debug
		 */
		app.use(function(req, res, next) {
			console.log(req);
			next();
		});
	}

	/** make resource available to request handlers
	  * @param {string} name - name of the resource
      *	@param {any} val - value of this item
	  */
	this.addItem = function(name, val) {
		context[name] = val;
	}

	/** serve static files
	  * @param {string} route - request routes to forward here
	  * @param {string} path - local directory of static files
	  */
	this.serveStatic = function(route, path) {
		app.use(route, express.static(__dirname + path));
	}
	/** add authentication procedure to server
	  * @param {function} authProc - function to user for authentication
	  */
	this.useAuthentication = function(authProc) {
		auth = authProc;
	}

	/** lift procedure to include context item
	  * @param {function} fun - procedure to be lifted
	  * @private
	  */
	function includeContext(fun) {
		
		return function(req, res, next) {
			fun(req, res, context, next);
		}
	}

	/** install handler at a certain route
	  * @param {function} setter - used to set handler at this route
	  * @param {function} handler - handler to be setted
	  * @private
	  */
	function install(route, method, handler) {

		if(handler && handler.auth && auth) {

			route[method](function(req, res, next) {
				auth(req, context, function(usr) {
					if(handler.auth(usr, req, context)) { 
						next(); 
					} else {
						res.sendStatus(401); // HTTP 401 Unauthorised
					}
				});
			});
		}

		if (handler) { 
			route[method](includeContext(handler)); 
		}
	}

	/** install a collection of handlers for HTTP-methods at a certain route
	  * @param {object} module - record that contains path information with different handlers
	  */
	this.installRoute = function(module) {

		var route = app.route(module.path);
		install(route, 'get', module.get);
		install(route, 'post', module.post);
		install(route, 'put', module.put);
		install(route, 'delete', module.delete);
	}

	/** start server on a certain port
	  * @param {number} port - port where server needs to listen
	  */
	this.listen = function(port) {

		var server = https.createServer(credentials, app);
		server.listen(port);
	}

	init();
}

exports.make = HTTPSServer;