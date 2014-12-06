/* ---- IMPORTS ---- */

const HTTPSServer = require('./server/server.js').HTTPSServer;
const Database = require('./server/modules/database.js').Database;
const authentication = require('./server/authentication').auth;
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');

/* ---- DATABASE INITIALISATION ---- */

const serverConfig = {
	ip:'localhost',
	port:2424, 
	username:'root', 
	password:'root'
};

const dbConfig = {
	dbname:'skribl_database', 
	username:'skribl', 
	password:'skribl'
};

const SKRIBLDatabase = new Database(serverConfig, dbConfig);

/* ---- SERVER INITIALISATION ---- */

const modules = [ bodyParser.json(),
				function(req, res, next) {
					req.basicAuth = basicAuth(req);
					next();
				}];

const SKRIBLServer = new HTTPSServer('./server/ssl/skribl.key', 
							  	     './server/ssl/skribl.cert', 
							  	      modules);

/* ---- CONFIGURE SERVER CONTEXT ---- */

SKRIBLServer.addItem('db', SKRIBLDatabase);

/* ---- CONFIGURE AUTHENTICATION PROCEDURE ---- */

SKRIBLServer.useAuthentication(authentication);

/* ---- CONFIGURE ROUTES ---- */

SKRIBLServer.installRoute(require('./server/routes/login.js'));
//SKRIBLServer.installRoute(require('./server/routes/user.js'));

/* ---- SERVE STATIC FILES ---- */

SKRIBLServer.serveStatic('/static', '/static');
SKRIBLServer.serveStatic('/', '/public');

/* ---- START SERVER ---- */

SKRIBLServer.listen(8443);

// curl -X POST -i -H "Content-type: application/json" -k https://localhost:8443/login -d '{"username":"noah", "password":"test"}'