/* ---- IMPORTS ---- */

var Server = require('./modules/server.js').make;
// var Database = require('./modules/database.js').make;

/* ---- SERVER + DATABASE INSTANTIATION ---- */

var SKRIBLServer = new Server('./ssl/skribl-key.pem', './ssl/skribl-cert.pem');
// var SKRIBLDatabase = new 

/* ---- CONFIGURE AUTHENTICATION PROCEDURE ---- */

// SKRIBLServer.addAuthentication(require('./modules/user.js').authenticate);

/* ---- CONFIGURE ROUTES ---- */

// SKRIBLServer.installRoute(require('./routes/user.js'));

/* ---- SERVE STATIC FILES ---- */

SKRIBLServer.serveStatic('/static', '/static');
SKRIBLServer.serveStatic('/', '/public');

/* ---- START SERVER ---- */

SKRIBLServer.listen(8443);