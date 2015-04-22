/*
//TESTCODE

var serverConfig = {ip:'wilma.vub.ac.be', port:2424, username:'root', password:'root'};
//var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
var dbConfig = {dbname:'skribl', username:'admin', password:'admin'};
var database = new Database(serverConfig, dbConfig);


var filename = "testfile2";
var path = "./" + filename + ".pdf";

var info = {
  uploader: "Goom1981",
  path: path
};

var fObject = {
	path: path,
	originalname: 'testfile2.pdf'
}

var metObject = {
	type: 'journal',
	journal: 'Cerberus Monthly',
	publisher: 'Illusive Industries',
	volume: '4',
	number: '19',
	year: 2430,
	abstract: 'Reaper killing 101',
	citations: 25,
	url: 'www.skynet.be',
	private: false,
	authors: [{firstName: 'Garrus',
				lastName: 'Vakarian'},
				{firstName: 'W',
				lastName: 'Urdnot'}]
	//knownAuthors: ['#13:33', '#13:4', '#13:35', '#13:34'],
	//researchDomains: ['Computer Sciences', 'Biological Sciences', 'Languages'],
	//keywords: ['killing', 'reapers', 'space']
}

var criteria = {
	title: 'How to kill Reapers',
	journal: 'Cerberus Monthly',
	publisher: 'Illusive Industries',
	fileName: 'testfile2.pdf',
	volume: 4,
	number: 19,
	url: 'www.skynet.be',
	ResearchDomains: ['Languages', 'Computer Sciences', 'Biological Sciences'],
	keywords: ['killing', 'reapers', 'space'],
	authors: [{firstName: 'John', lastName: 'Shepard'}, {firstName: 'Gar', lastName: 'Vakar'}, {firstName: 'M', lastName: 'Braem'}]
};
 
var criteria2 = {
	number: 19
};

var d = new Date();
var t = d.getTime();


//database.authorPublications('#13:669', callBack);
//database.getAuthorGraph('#13:888', 5, callBack);
//database.reset(callBack);
//database.getAuthorGraph(callBack);
//database.testError(callBack);
//database.queryAdvanced(criteria2, 10, callBack);
//database.searchAuthor('Heli', 'Copter', 10, callBack);
//database.loadLibrary('brol', 'Uploaded', callBack);
//database.removeLibrary('test2', 'newlib', callBack);
//database.addLibrary('test2', 'newlib', callBack);
//database.testTransaction('jshep', callBack);
//database.loadLibraries('hcopter', callBack);
//database.loadUser('RvdStraeten', callBack);
//database.deleteUser('test1', callBack);
//database.querySimple(19, 10, callBack);
//database.createLibrary('tkrios', 'TestLib', callBack);
//database.addToLibrary('test3', 'Favorites', '#23:13', callBack);
//database.loadLibrary('HPinson', 'Uploaded', callBack);
//database.addJournal('How to kill Reapers', fObject, 'jshep', callBack);
//database.getPublication('#23:13', callBack);
//database.uploadedBy('#21:38', callBack);
//database.loadPublication('#23:14', info.path, callBack);
//database.updatePublication('#23:16', metObject, callBack);
//database.removePublication('#23:132', callBack);
//
//

//var userInfo = {firstName:'John', lastName:'Shepard', username:'jshep', password:'Algoon1', email:'jshep@vub.ac.be', language:'ENG', institution: 'VUB', faculty: 'letteren en wijsbegeerte', department: 'mgermaanse talen', researchGroup: 'engels', researchDomains: ['Biological Sciences', 'Languages']};
var userInfo = { firstName: "Beli",
lastName: "Copter",
language: "NL",
username: 'bcopter',
password: "HCopt123",
email: "hcopter@vub.ac.be",
institution: "VUB",
faculty: "Exact sciences",
department: "DINF",
researchDomains: ["Computer and Information Science"],
researchGroup: "none" }
*/
/*
UM.createUser(userInfo, function(error, res) {
	if(error) {
		console.log(res);
		callBack(error);
	}
	else {
		database.createUser(res, callBack);
	}
})
*/

/*
function callBack(error, result){
	var nd = new Date();
	var nt = nd.getTime();
	var res = nt - t;
	console.log('operation took: ' + res + 'ms');
	if (error){
	console.log(error);
	}
	else{
	console.log(result);
	//printUser(result);
	}
	stop();
}


function stop(){
	process.exit(code=0);
}

*/

