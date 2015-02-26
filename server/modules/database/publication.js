

var RID = require('./rid.js');
var fs = require('fs');
var Path = require('path');
var Author = require('./author.js');

 /** 
   *Create a new Publication object, provides functionality to database Object.
   *@class
   *@classdesc Represents a domain-specific publication instance
   *@constructor 
 *@param {Object} db - database link
 */
function Publication(db) {

	var AUT = new Author.Author(db);

	/**
	 * Will add a publication and link it with the proper uploader and author.
	 * @param {Object}   pubRecord object which contains information about the publication.
	 * @param {callBack} callback 
	 * @return {String}	 callback called with publicationRid
	 */
	
	 this.addPublication = function(path, pub, uploader, library, callback) {
		var publicationRid;

		/**
		 * will load a file into a buffer as base64 encoded.
		 * @param  {String}   path     path to file
		 * @param  {callBack} callback 
		 * @return {Object}   calls callback with resulting data
		 */
		function getFile(path, clb) {
			var file;

			fs.readFile(path, 'base64', function(error, data) {
				if(error) {
					callback(error);
				}
				else {
					clb(null, data);
				}
			});
		}
	
	/**
		 * Will add vertices and links to database.
		 * @param  {Object} error dummy var, will never catch Error.
		 * @param  {Object} data  data loaded by getFile	
		 */
		function createPub(error, data) {
			db.select().from('User').where({username: uploader}).all()
			.then(function(users) {
				if(users.length) {
					db.query('create vertex Publication set Title = \'' + pub.getTitle() + '\', Data = \'' + data + '\'')
					.then(function(publication) {
						publicationRid = RID.getRid(publication[0]);		
						var userRid = RID.getRid(users[0]);
						db.edge.from(userRid).to(publicationRid).create({
							'@class': 'Uploaded'
						});

						var exitCounter = 0;
						var forCounter = 0;
						var authors = pub.getAuthors();
						for (var i = 0; i < authors.length; i++) {
							AUT.addAuthor(authors[i].getFirstName(), authors[i].getLastName(), function(error, authorRid) {

								db.edge.from(authorRid).to(publicationRid).create({
									'@class': 'Published'
								})
								.then(function(edge) {
									forCounter++;
									if(forCounter == authors.length) {
										exitCounter++;
										if(exitCounter == 2) {
											callback(null, publicationRid);
										}
									}
								
								});							
							});	
						}

						db.addToLibrary(uploader, library, publication, function(error, result) {
							if(error) {
								callback(error);
							}
							else {
								exitCounter++;
								if(exitCounter == 2) {
											callback(null, publicationRid);
										}
							}

						});

					});
				}
				else {
					callback(new Error('User with username: ' + pubRecord.getUploader() + ' does not exist.'));
				}
			});	
		}
		getFile(path, createPub);
	};


	/**
	 * constructs a function that takes a path and a callback, to load a file from database to a given location.
	 * @param  {String}   id       record id of publication
	 * @param  {callBack} callback
	 * @return {Object}   a function is returned.
	 */
	this.loadPublication = function(id, path, clb) {
		var newPath = path + '/' id + '.pdf'
		db.record.get(id)
		.then(function(res) {
			fs.writeFile(newPath, res.Data, function (err) {
  				if (err) {
  					clb(new Error(err));
  				}
  				else {
  					clb(null, true);
  				}
			});
		});
	}

	//incomplete, returned object will support .Title only (+database info)
	this.getPublication = function(id, clb) {
		db.record.get(id)
		.then(function(res) {
			if(res.length) {
				var metObject = res[0];
				delete metObject.Data
				clb(null, metObject);
			}
			else {
				clb(new Error('Publication not found'));
			}
		});
		
	}

	this.removePublication = function(id, callback) {
		db.query('select from Publication where @rid = ' + id)
		.then(function(publications) {
			if(publications.length) {
				db.vertex.delete(id)
				.then(function(nr) {
					callback(null, true);
				});
			}
			else {
				callback(null, true);
			}
		});
	};
}
exports.Publication = Publication;
