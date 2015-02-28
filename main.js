/* ---- IMPORTS ---- */

const HTTPSServer = require('./server/server.js').HTTPSServer;
const Database = require('./server/modules/database/database.js').Database;
const authentication = require('./server/authentication').auth;
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth');
const multer = require('multer');

/* ---- DATABASE INITIALISATION ---- */

const serverConfig = {
	ip:'wilma.vub.ac.be',
	port:2424, 
	username:'root', 
	password:'root'
};

const dbConfig = {
	dbname:'skribl', 
	username:'admin', 
	password:'admin'
};

const SKRIBLDatabase = new Database(serverConfig, dbConfig);

/* ---- SERVER INITIALISATION ---- */

const modules = [ bodyParser.json(),
                  multer({dest: "./uploads/"}),
				function(req, res, next) {
					req.basicAuth = basicAuth(req);
					next();
				},
				/** @debug -- log requests */
				function(req, res, next) {
					console.log({BODY: req.body, 
								FILES: req.files, 
								AUTH: req.basicAuth});
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
SKRIBLServer.installRoute(require('./server/routes/user.js'));
SKRIBLServer.installRoute(require('./server/routes/publications-A.js'));
SKRIBLServer.installRoute(require('./server/routes/publications-B.js'));
SKRIBLServer.installRoute(require('./server/routes/user-library.js'));

/* ---- SERVE STATIC FILES ---- */
//SKRIBLServer.serveStatic('/static', __dirname + '/static');
//SKRIBLServer.serveStatic('/', __dirname + '/public');

/* ---- START SERVER ---- */

console.log("Setting up server @ port 8443");
SKRIBLServer.listen(8443);
