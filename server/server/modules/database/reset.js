var UM = require('../user.js');
var RID = require('./rid.js');

var pubData = require('./testData/publicationData_noAbstract.js');
var userData = require('./testData/userData.js');

function ResetDB(db, database) {
	var pubsPath = './testData/publications';

	function addUsers(clb) {
		var ctr = 0;
		for (var i = 0; i < userData.length; i++) {
			UM.createUser(userData[i], function(error, res) {
				if(error) {
					clb(error);
				}
				else {
					database.createUser(res, function(error, res) {
						if(error) {
							clb(error);
						}
						else {
							ctr++;
							if(ctr == userData.length) {
								clb(null, true);
							}
						}
					});
				}		
			});
		};
	}

	function getId(authorObj, clb) {
		db.select().from('Author').where('firstName = \'' + authorObj.firstName + '\' and lastName = \'' + authorObj.lastName + '\'').all()
		.then(function(res) {
			if(res.length) {
				clb(null, RID.getRid(res[0]));
			}
			else {
				clb(null, false);
			}

		}).error(function(er) {
			clb(er);
		});
	}

	function prepPubMetadata(pubMetData, clb) {
		var authors = pubMetData.authors;
		var newAuthors = [];
		pubMetData.knownAuthors = [];

		var ctr = 0;
		for (var i = 0; i < authors.length; i++) {
			getId(authors[i], function(error, res) {
				if(res) {
					pubMetData.knownAuthors.push(res);
				}
				else {
					newAuthors.push(authors[ctr]);
				}

				ctr++;
				if(ctr == authors.length) {
					pubMetData.authors = newAuthors;
					clb(null, pubMetData);
				}
			});
		};
	}

	function addJ(metaDataArray, idx, username, clb) {
		metaDataArray[idx].title
		var info = {path: pubsPath + '/' + metaDataArray[idx].fileName, originalname: metaDataArray[idx].fileName};
		database.addJournal(metaDataArray[idx].title, info, username, function(error, rid) {
			if(error) {
				clb(error);
			}
			else {
				prepPubMetadata(metaDataArray[idx], function(error, metaData) {
					database.updatePublication(rid, metaData, function(error, res) {
						if(error) {
							clb(error);
						}
						else {
							clb(null, true);
						}
					});
				});
			}
		});
	}

	function addP(metaDataArray, idx, username, clb) {
		metaDataArray[idx].title
		var info = {path: pubsPath + '/' + metaDataArray[idx].fileName, originalname: metaDataArray[idx].fileName};
		database.addProceeding(metaDataArray[idx].title, info, username, function(error, rid) {
			if(error) {
				clb(error);
			}
			else {
				prepPubMetadata(metaDataArray[idx], function(error, metaData) {
					database.updatePublication(rid, metaData, function(error, res) {
						if(error) {
							clb(error);
						}
						else {
							clb(null, true);
						}
					});
				});
			}
		});
	}

	function addPubs(clb) {
		var ctr = pubData.length;
		function myLoop(i) {
			setTimeout(function() {
				if(pubData[i-1].type == 'journal') {
					addJ(pubData, i-1, 'HPinson', function(error, res) {
						if(error) {
							clb(error);
						}
						if(--ctr == 0) {
							clb(null, true);
						}
					});
				}
				else if(pubData[i-1].type == 'proceeding') {
					addP(pubData, i-1, 'HPinson', function(error, res) {
						if(error) {
							clb(error);
						}
						if(--ctr == 0) {
							clb(null, true);
						}
					});
				}
				else {
					clb(new Error('type:' + pubData[i-1].type + 'not recognized'));
				}
				if (--i) myLoop(i);
			}, 150);
		}
		myLoop(pubData.length);
	}

	function cleanDb(clb) {
		db.query('delete from v').all()
		.then(function(res) {
			db.query('delete from e').all()
			.then(function(res) {
				clb(null, true);
			}).error(function(er) {
				clb(er);
			});
		}).error(function(er) {
			clb(er);
		});
	}

	this.reset = function(clb) {
		cleanDb(function(error, res) {
			if(error) {
				clb(error);
			}
			else {
				addUsers(function(error, res) {
					if(error) {
						clb(error);
					}
					else {
						addPubs(clb)
					}
				});
			}
		});
		
		//cleanDb(clb);
	}

}

exports.ResetDB = ResetDB;