/* ---- IMPORTS ---- */

var HTTPSServer = require('./server/server.js').make;
// var Database = require('./modules/database.js').make;
var authentication = require('./server/authentication').auth;
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');

/* ---- DATABASE INITIALISATION ---- */

// var SKRIBLDatabase = new 

/* ---- SERVER INITIALISATION ---- */

var modules = [ bodyParser.json(),
				function(req, res, next) {
					req.basicAuth = basicAuth(req);
					next();
				}];

var SKRIBLServer = new HTTPSServer('./server/ssl/skribl-key.pem', 
							  	   './server/ssl/skribl-cert.pem', 
							  	   modules);

/* ---- CONFIGURE SERVER CONTEXT ---- */

// SKRIBLServer.addItem('db', SKRIBLDatabase);

/* ---- CONFIGURE AUTHENTICATION PROCEDURE ---- */

SKRIBLServer.useAuthentication(authentication);

/* ---- CONFIGURE ROUTES ---- */

SKRIBLServer.installRoute(require('./server/routes/login.js'));
SKRIBLServer.installRoute(require('./server/routes/user.js'));

// for testing
//SKRIBLServer.installRoute(require('./server/routes/testRoute.js'));

/* ---- SERVE STATIC FILES ---- */

SKRIBLServer.serveStatic('/static', '/static');
SKRIBLServer.serveStatic('/', '/public');

/* ---- START SERVER ---- */

SKRIBLServer.listen(8443);

// curl -X POST -i -H "Content-type: application/json" -k https://localhost:8443/login -d '{"username":"noah", "password":"test"}'