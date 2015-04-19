var DB = require('./database.js');

var serverConfig = {ip:'wilma.vub.ac.be', port:2424, username:'root', password:'root'};
//var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
var dbConfig = {dbname:'skribl', username:'admin', password:'admin'};
var database = new DB.Database(serverConfig, dbConfig);

var d = new Date();
var t = d.getTime();


database.reset(function(error, res) {
	if(error) {
		console.log('reset encountered problem:')
		console.log(error);
		stop();
	}
	else {
		console.log('database resetted');
		var nd = new Date();
		var nt = nd.getTime();
		var res = nt - t;
		console.log('operation took: ' + res + 'ms');
		stop();
	}
});

function stop(){
	process.exit(code=0);
}