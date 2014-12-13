

var RID = require('./rid.js');
var fs = require('fs');
var path = require('path');

function Publication(db) {



	function binEncode(data, callback) {

	//array holds the initial set of un-padded binary results
	var binArray = []

	//the string to hold the padded results
	var datEncode = "";

	//encode each character in data to it's binary equiv and push it into an array
	for (i=0; i < data.length; i++) {
	binArray.push(data[i].charCodeAt(0).toString(2));

	}

	//loop through binArray to pad each binary entry.
	for (j=0; j < binArray.length; j++) {
	//pad the binary result with zeros to the left to ensure proper 8 bit binary
	var pad = padding_left(binArray[j], '0', 8);

	//append each result into a string
	datEncode += pad + ' ';

	}

	//function to check if each set is encoded to 8 bits, padd the left with zeros if not.

	function padding_left(s, c, n) {
	if (! s || ! c || s.length >= n) {
	return s;
	}

	var max = (n - s.length)/c.length;
	for (var i = 0; i < max; i++) {
	s = c + s;
	}

	return s;
	}
	//string of padded results in console
	console.log(datEncode);
	}


	this.addPublication = function(pubRecord, callback) {
		var self = this;
		function getFile(path, callback) {
			var file;
			fs.readFile(path, 'base64', function(error, data) {
				if(error) {
					callback(error);
				}
				else {
					callback(null, data);
				}
			});
		}

		var publicationRid;
		var path;
		pubRecord.loadPath(function(p) {
			path = p;
		});

		getFile(path, function(error, data) {
			db.query('create vertex Publication set Title = \'' + pubRecord.getTitle() + '\', Data = \'' + data + '\'')
			.then(function(publication) {
				console.log(publication);
				publicationRid = RID.getRid(publication[0]);
				db.select().from('User').where({username: pubRecord.getUploader()}).all()
				.then(function(users) {
					if(users) {
						var userRid = RID.getRid(users[0]);
						db.edge.from(userRid).to(publicationRid).create({
							'@class': 'Uploaded'
							});
				
						callback(null, publicationRid);
					}
					else {
						callback(new Error('User with username: ' + pubRecord.getUploader() + ' does not exist'));
					}
				})	
			});		
		});
	}
}
exports.Publication = Publication;

/*
var fs = require('fs');
var path = require('path');


var path = path.join(__dirname, '/testfile.txt');
var t = fs.readFile(path, 'base64', callBack);
*/