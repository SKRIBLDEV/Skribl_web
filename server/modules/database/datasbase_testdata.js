/*
{firstName:'John', lastName:'Shepard', username:'jshep', password:'Algoon1', email:'jshep@vub.ac.be', language:'NL', institution: 'KU Leuven', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'engels', researchDomains: ['Biological Sciences']}
{firstName:'Miranda', lastName:'Lawson', username:'mlaw', password:'Algoon2', email:'mlaw@vub.ac.be', language:'NL', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'engels', researchDomains: ['Biological Sciences']}
{firstName:'Garrus', lastName:'Vakarian', username:'gvak', password:'Algoon3', email:'gvak@vub.ac.be', language:'NL', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'engels', researchDomains: ['Biological Sciences']}
{firstName:'Thane', lastName:'Krios', username:'tkrios', password:'Algoon4', email:'tkrios@vub.ac.be', language:'NL', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'engels', researchDomains: ['Biological Sciences']}
{firstName:'Grunt', lastName:'Urdnot', username:'gurdnot', password:'Algoon5', email:'gurdnot@vub.ac.be', language:'NL', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'engels', researchDomains: ['Biological Sciences']}
{firstName:'Karin', lastName:'Chakwas', username:'kchakwas', password:'Algoon6', email:'kchakwas@vub.ac.be', language:'NL', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'engels', researchDomains: ['Biological Sciences']}
{firstName:'Mordin', lastName:'Solus', username:'msolus', password:'Algoon7', email:'msolus@vub.ac.be', language:'NL', institution: 'Vrije Universiteit Brussel', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'engels', researchDomains: ['Biological Sciences']}
*/

var UM = require('../user.js');
var DB = require('./database.js');


//ADD USERS HERE
var userArray = [
{firstName:'Rhys', lastName:'Howe', username:'Goom1981', password:'FohToo5Tee', email:'RhysHowe@jourrapide.com', language:'ENG', institution: 'KU Leuven', faculty: 'letteren en wijsbegeerte', department: 'taal en letterkunde', researchGroup: 'Engels', researchDomains: ['Arts and Literature', 'Literature']},
{firstName:'Jay', lastName:'Howard', username:'Jaces1993', password:'keeF5gee5', email:'JayHoward@teleworm.us', language:'ENG', institution: 'Vrije Universiteit Brussel', faculty: 'bio-ingenieurswetenschappen', department: 'computerwetenschappen', researchGroup: 'Artificial Intelligence', researchDomains: ['Computer and Information Science', 'Artificial Intelligence']},
{firstName:'Shana', lastName:'Berens', username:'Fauting', password:'Quarai6iej', email:'ShanaBerens@armyspy.com', language:'NL', institution: 'Vrije Universiteit Brussel', faculty: 'bio-ingenieurswetenschappen', department: 'computerwetenschappen', researchGroup: 'Software Languages', researchDomains: ['Computer and Information Science', 'Programming Languages', 'Algorithms and Computational Theory']}
];



function stop(){
	process.exit(code=0);
}

function callBack(error, result){
	if (error){
	console.log(error);
	}
	else{
	console.log(result);
	//printUser(result);
	}
	stop();
}

function callBack1(error, result){
	if (error){
	console.log(error);
	}
	else{
	console.log(result);
	//printUser(result);
	}
}

function addUserTestData(users, callback) {

	//var serverConfig = {ip:'wilma.vub.ac.be', port:2424, username:'root', password:'root'};
	var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
	var dbConfig = {dbname:'skribl_database', username:'skribl', password:'skribl'};
	var database = new DB.Database(serverConfig, dbConfig);


	function iter(nr) {
		if(nr !== users.length) {
			var user = users[nr];
			UM.createUser(user, function(error, user) {
				database.createUser(user, function(error, val) {
					iter(++nr);
				});
			});
		}
		else {
			callback(null, true);
		}
	}
	iter(0);
}

addUserTestData(userArray, callBack);