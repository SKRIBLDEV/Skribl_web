/**
*Database API
*author: Ivo
*co-authors: Hannah, Noah
*exports one constructor: Database(serverConfig, dbConfig)
*with methods to interact this database */

/* ---- TODO -------- *
* test with jasmine
* write function to add connection researchgroup-->researchdomain
* write function to delete affiliatins (low priority)
* ----- END TODO ---- */

/**
 * This callback is displayed as a global member.
 * @callback callBack
 * @param {object} error - null or error object
 * @param {mixed} returnvalue - any value that needs to be returned
 */




var Oriento = require('oriento');
var UM = require('../user.js');
var Affil = require('./affiliation.js');
var RDomain = require('./researchdomain.js');
var RID = require('./rid.js');
var Publication = require('./publication.js');
var library = require('./library.js');
var path = require('path');
var fs = require('fs');

 /** 
   *Create a new database object.
   *@class
   *@classdesc Represents a domain-specific database instances
   *@constructor 
 *@param {object} serverConfig - includes configuration for server
 *@param {object} dbConfig - includes configuration for database
 */
function Database(serverConfig, dbConfig) {
	
	/* instantiates the database server instance */
	var server = Oriento({
		host: serverConfig.ip,
		port: serverConfig.port,
		username: serverConfig.username || 'root',
		password: serverConfig.password || 'root'
	});

	/** instantiates the database instance*/
	var db = server.use({
		name: dbConfig.dbname,
		username: dbConfig.username || 'admin',
		password: dbConfig.password || 'admin'
	});

	var self = this;
	var aff = new Affil.Affiliation(db);
	var RD = new RDomain.ResearchDomain(db);
	var PUB = new Publication.Publication(db);
	var Lib = new library.Library(db);


	this.addPublication = PUB.addPublication;
	this.loadPublication = PUB.loadPublication;
	this.getPublication = PUB.getPublication;
	this.updatePublication = PUB.updatePublication;
	this.removePublication = PUB.removePublication;
	this.uploadedBy = PUB.uploadedBy;
	this.loadLibrary = Lib.loadLibrary;
	this.addToLibrary = Lib.addToLibrary;
	this.addDefaults = Lib.addDefaults;
	/**
	*Will give the subdivisions of a given division.
	*@param {callBack} callback - handles response
	*@param {String} institution - name of institution
	*@param {String} [faculty] - name of faculty
	*@param {String} [department] - name of department
	*@return {Array<String>} array of names of subdivisions
	*/
	this.getSubdivisions = function(callback, institution, faculty, department) {
		var division;
		function compileResult(nameSubdivisions, classSubDivisions) {
			var className = division['@class'];
			var divisionRid = RID.getRid(division);
			db.query('select Name from ' + classSubDivisions + ' where ' + className +' = ' + divisionRid)
			.then(function(results) {
				var resArray = []; //TODO replace by new Array(results.length)??
				for(var i = 0; i < results.length; i++) {
					resArray.push(results[i].Name);
				}
				callback(null, resArray);
			});
		}

		if(institution === undefined) {
			callback(new Error('No path to subdivisions, give at least Institution.'));
		} else {
			db.query('select from Institution where Name = \'' + institution +'\'')
			.then(function(institutions) {
				if(institutions.length) {
					division = institutions[0];
				} else {
					callback(new Error('Institution with name: \'' + institution + '\' does not exist'));
				}
			})
			.then(function() {
				if(faculty === undefined) {
					compileResult('Faculties', 'Faculty');
				} else {
					var institutionRid = RID.getRid(division);
					db.query('select from Faculty where Name = \'' + faculty + '\' and Institution = ' + institutionRid)
					.then(function(faculties) {
						if(faculties.length) {
							division = faculties[0];
						} else {
							callback(new Error('Faculty with name: ' + faculty + ' does not exist'));
						}
					})
					.then(function() {
						if(department === undefined) {
							compileResult('Departments', 'Department');
						} else {
							var facultiesRid = RID.getRid(division);
							db.query('select from Department where Name = \'' + department + '\' and Faculty = ' + facultiesRid)
							.then(function(departments) {
								if(departments.length) {
									division = departments[0];
									compileResult('ResearchGroups', 'ResearchGroup');
								} else {
									callback(new Error('Department with name: ' + department + ' does not exist'));
								}
							});
						}
					});
				}
			});
		}
	};
	
	/**
	 * will check if a user exists
	 * @private
	 * @param  {Object}   	contains user info
	 * @param  {callback} 	callback
	 * @return {Boolean}	by callback
	 */
	this.userExists = function(data, callback) {
		db.select().from('User').where({username: data.getUsername()}).all()
			.then(function (resultUsernames) {
				callback(null, resultUsernames.length > 0);
			});
			// @ Ivo, if you want, add e-mail check here too...
			// however, i don't think its necessary right now...
			// I copy pasted the code down here, so you wouldn't lose it ;)
			// @ Noah, do we allow multiple users with the same e-mail adress? or does the check take place somewhere else? otherwise I think we need this.
			/* 
					db.select().from('User').where({email: newData.email}).all()
						.then(function (resultEmail) {
								if (resultEmail.length){
									callback('email-taken');
								}
			*/
	};
	
	/**
	*will check if user already exists before calling addUser() to add user to the database.
	*@private
	*@param {object} newData - object which contains userinfo
	*@param {callBack} callback - will be called when done with function, with 'username-taken', 'email-taken' or passed to addUser()
	*/
	this.createUser = function(newData, callback) {

		this.userExists(newData, function(err, exists) {

			// TODO: err should have seperate if-clause
			if (err || exists) {
				callback(new Error('username taken!'));
			} else {
				addUser(newData, callback);
			}
		});
	};
					


	/**
	 * if given a username: will return all researchdomains of user in an Array, otherwise will return all researchdomains.
	 * @param  {String}   username
	 * @param  {callBack} callback
	 * @return {Array<String>}	array of researchdomain names.
	 */
	this.getResearchDomains = function(username, callback) {
		if(typeof username === 'string') {
			db.query('select * from (traverse * from (select * from User where username = \'' + username + '\') while $depth < 2) where @class = \'ResearchDomain\'')
			.then(function(researchDomains) {
				var resArray = [];
				for (var i = 0; i < researchDomains.length; i++) {
					resArray.push(researchDomains[i].Name);
				}
				callback(null, resArray);
			});
		}
		else {
			db.select().from('ResearchDomain').all()
			.then(function(domains) {
				var resArray = [];
				for (var i = 0; i < domains.length; i++) {
					resArray.push(domains[i].Name);
				}
				callback(null, resArray);
			});
		}
	};

///WITH TRANSACTIONS
	/**
	 * Deletes user with given username from database, throws error if user doesn't exist.
	 * @param  {string}   username
	 * @param  {callback} callback
	 */
	this.deleteUser = function (username, callback) {
		db.select().from('User').where({username: username}).all()
		.then(function(res) {
			if(res.length) {
				var usrRid = RID.getRid(res[0]);
				var trx = db.let('user', function(s) {
					s.select()
					.from('User')
					.where({username: username});
				});
				Lib.deleteDefaults(username, trx, function(error, res) {
					trx.let('delUser', function(s) {
						s.delete('vertex', 'User')
						.where('@rid = ' + usrRid);
					})
					.commit().return('$delUser').all()
					.then(function(res) {
						callback(null, true);
					});
				});
			}
			else {
				callback(new Error('user with username: ' + username + ' does not exist'));
			}
		});
	};

	/**
	*will return user object by callback
	*@param {string} username - called if combination exists.
	*@param {function} callback - called with user object if success or with 'user-not-found' if fail
	*/
	this.loadUser = function(username, callback) {
		db.select().from('User').where({username: username}).all()
		.then(function(users) {
			if(users.length) {
				var dbRec = users[0];
				aff.getAffiliation(dbRec, function(error, user) {
					self.getResearchDomains(user.username, function(error, resdomains) {
						user.researchDomains = resdomains;
						callback(error, new UM.UserRecord(user));
					});
				});
			} 
			else {
			   callback(new Error('user not found'));
			}
		});
	};

///WITH TRANSACTIONS
	//find a way to make a transaction out of this, at the moment eventual causes for errors are caught in user.js validation.
	/**
	 * adds user with given data to database
	 * @private
	 * @param {Object}   newData
	 * @param {callBack} callback
	 */
	function addUser(newData, callback){
		var trx = db.let('user', function(s) {
			s.create('vertex', 'User')
			.set({
				firstName: newData.getFirstName(),
				lastName: newData.getLastName(),
				email: newData.getEmail(),
				username: newData.getUsername(),
				password: newData.getPassword(),
				language: newData.getLanguage()
			});
		});

		Lib.addDefaults(newData.getUsername(), trx, function(error, res) {
					if(error) {
						callback(error);
					}
					else {
						aff.addAffiliation(newData, trx, function(error, res) {
							trx.let('researchGroupEdge', function(s) {
								s.create('edge', 'InResearchGroup')
								.from('$user')
								.to('$researchGroup');
							});
							RD.addResearchDomains(newData.getResearchDomains(), trx, function(error, res) {
								if(error) {
									callback(error);
								}
								else {
									trx.commit().return('$user').all()
									.then(function(res) {
										callback(null, res);
									});
								}
							});
						});
					}
				});
	}

	/**
	 * currently only in use for testing purposes, deletes a researchdomain.
	 * @param  {String}   name     name of domain
	 * @param  {callBack} callback 
	 */
	this.deleteResearchDomain = function(name, callback) {
		db.select().from('ResearchDomain').where({Name: name}).all()
		.then(function(domain) {
			var domainRid = RID.getRid(domain[0]);
			db.vertex.delete(domainRid) 
			.then(function(){
				callback(null, true);
			});
		});
	};


	////////TESTING TRANSACTIONS/////
	
	this.testTransaction = function(username, clb) {
		var Batch = db.let('peek', function(s) {
						s.select().from('Author').where({TempId: 1});
					console.log('t1');
		});
		/*
		.let('addAuthor', function(s) {
			s.create('vertex', 'Author')
			.set({
				firstName: 't2',
				TempId: 3,
				lastName: 't2'
			});
			console.log('t2');
		});
		*/

		Batch
		.let('delAuthor', function(s) {
			s.delete('vertex')
			.where('@rid = #12:5');
			console.log('t2');
		});
		
		//db.select().from('User').where({username: 'username'})

		Batch
		.let('peek', function(s) {
			s.select().from('Author').where({TempId: 3});
			console.log('t3');

			//console.log(Batch._state.let);
			console.log('t4');
		})
		.commit()
		.return('$delAuthor')
		.all()
		.then(function(usrs) {
			if(usrs.length) {
				clb(usrs[0]);
				//clb('success');
			}
			else {
				clb(new Error('user not found'));
			}
		})
		.done();
	}

	function testTransaction2(username, Batch, clb) {
		Batch.let('peek', function(s) {
			s.select().from('User').where({username: username});
		});

		Batch.let('addAuthor2', function(s) {
			s.create('vertex', 'Author')
			.set({
				firstName: 't1',
				lastName: 't1'
			});
		});

		for (var i = 0; i < 10000; i++) {
				if(i == 10000) {
					Batch.let('lasttest', function(s) {
						throw 'test';
					});
				}
			};
	}
	
}

exports.Database = Database;

//TESTCODE

//var serverConfig = {ip:'wilma.vub.ac.be', port:2424, username:'root', password:'root'};
var serverConfig = {ip:'localhost', port:2424, username:'root', password:'root'};
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

//database.testTransaction('jshep', callBack);

//database.loadUser('jshep', callBack);
database.deleteUser('test1', callBack);

//database.createLibrary('tkrios', 'TestLib', callBack);
//database.addPublication(fObject, 'jshep', callBack);
//database.addToLibrary('tkrios', 'TestLib', '#21:38', callBack);
//database.loadLibrary('tkrios', 'TestLib', callBack);
//database.getPublication('#21:38', callBack);
//database.uploadedBy('#21:38', callBack);
//database.loadPublication('#21:38', info.path, callBack);
//
//
/*
var userInfo = {firstName:'Helene', lastName:'Vervlimmeren', username:'test3', password:'Algoon1', email:'jshep@vub.ac.be', language:'ENG', institution: 'VUB', faculty: 'letteren en wijsbegeerte', department: 'brol', researchGroup: 'engels', researchDomains: ['Biological Sciences']};
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


function stop(){
	process.exit(code=0);
}




