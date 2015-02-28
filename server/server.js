var express = require('express');
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
	var server;

	/** initialise function for HTTPSServer-object
	  * @private
	  */
	function init() {

		// setup credentials for SSL (HTTPS)
		credentials.key = fs.readFileSync(key);
		credentials.cert = fs.readFileSync(cert);

		// enable middleware for CORS
		app.use(function(req, res, next) {
    		res.header('Access-Control-Allow-Origin', '*');
		 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	 		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	 		next();
		});
		
		// configure extra modules
		for(var i = 0; i < modules.length; ++i) {
			app.use(modules[i]);
		}
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
		app.use(route, express.static(path));
	}

	/** add authentication procedure to server
	  * @param {Function} authProc - function to user for authentication
	  */
	this.useAuthentication = function(authProc) {
		auth = authProc;
	}
	
	/** lift procedure to include context item
	  * @param {Function} fun - procedure to be lifted
	  * @private
	  */
	function includeContext(fun) {
		
		return function(req, res, next) {
			fun(req, res, context, next);
		}
	}

	/** install handler at a certain route with a HTTP method
	  * @param {Function} setter - used to set handler at this route
	  * @param {Function} handler - handler to be assigned at route
	  * @private
	  */
	function install(route, method, handler) {

		if(handler && handler.auth && auth) {

			route[method](function(req, res, next) {
				auth(req, context, function(usr) {
					handler.auth(usr, req, context, function(err, success) { 
						if (success)
							next(); 
						else if (err)
							res.sendStatus(500); // HTTP 500 Server error
						else 
							res.sendStatus(401); // HTTP 401 Unauthorised
					});
				});
			});
		}

		if (handler) { 
			route[method](includeContext(handler)); 
		}
	}

	/** install a collection of handlers for HTTP-methods at a certain route
	  * @param {Object} module - record that contains path information with different handlers
	  */
	this.installRoute = function(module) {

		var route = app.route(module.path);

		//preprocessing required?
		if(module.preprocess) {
			route.all(function(req, res, next) {
				module.preprocess(req, res, context, next);
			});
		}

		//install routes for HTTP methods
		install(route, 'get', module.get);
		install(route, 'post', module.post);
		install(route, 'put', module.put);
		install(route, 'delete', module.delete);
		install(route, 'head', module.head)
	}

	/** start server on a certain port
	  * @param {number} port - port where server needs to listen
	  */
	this.listen = function(port) {

		if (!server) {
			//server = https.createServer(credentials, app);
			/*--- [uncomment if you have problems with HTTPS/SSL] ---*/
			server = require('http').createServer(app);
		}

		server.listen(port);
	}

	init();
}

exports.HTTPSServer = HTTPSServer;
