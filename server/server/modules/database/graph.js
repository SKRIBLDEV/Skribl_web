
const RID = require('./rid.js');
function Graph(db, AUT, myDB) {

	//XXX: zie opmerking over modules...

	/**
	 * gets username of userprofile connected to given author profile
	 * @param  {String} id  author id
	 * @param  {callBack} clb 
	 * @return {String}     username
	 */
	function getUsername(id, clb) {
		db.query('select expand(in(\'IsAuthor\')) from ' + id).all()
		.then(function(res) {
			//XXX: laat undefined weg in de else tak...
			//XXX: of gebruik iets van de vorm clb(null, (res.length? res[0].username: undefined)
			if(res.length) {
				clb(null, res[0].username)
			}
			else {
				clb(null, undefined);
			}
		//XXX: geef meteen de callback mee
		}).error(function(er) {
			clb(er);
		});
	}

	function authorsIterate(authors, idx, resArray, pubObj, clb) {
		var author1 = authors[idx];
		var ctr = idx+1;
		//XXX: gebruik === ipv == 
		if(ctr == authors.length) {
			clb(null, true);
		}
		//XXX: i & ctr lopen weer parallel
		//XXX: gebruik hier een gewone for-lus, gevolgd door de callback
		//XXX: zet de length dan ook in een variabele 'len' voor de for-conditie
		for (var i = idx+1; i < authors.length; i++) {
			resArray.push([author1, pubObj, authors[i]]);
			if(++ctr == authors.length) {
				clb(null, true);
			}
		};
	}

	function constructResObjects(array, idx, resArray, clb) {
		var resObj = array[idx];
		var pubObj = {id: RID.transformRid(resObj.rid), title: resObj.title, type: resObj.class};
		AUT.getAuthorObjects(resObj.authors, function(error, autObjects) {
			if(error) {
				clb(error);
			}
			else {
				var ctr = 0;
				//XXX: zet de length in een variabele len
				for (var i = 0; i < autObjects.length; i++) {
					authorsIterate(autObjects, i, resArray, pubObj, function(error, res) {
						//XXX: gebruik === ipv ==
						//XXX: gebruik hier dan ook len
						if(++ctr == autObjects.length) {
							clb(null, true);
						}
					});
				};
			}
		});
	}

	/**
	 * will return edges of graph in form: [{fromAuthorObject,  publicationObject, toAuthorObject}, {...}, ...]		
	 * @param  {String} authId author id 
	 * @param  {Integer} depth  depth of search in database
	 * @param  {callBack} clb    
	 * @return {Array<Array<Object>>}        edges of graph in form: [{fromAuthorObject,  publicationObject, toAuthorObject}, {...}, ...]	
	 */
	this.getAuthorGraph = function(authId, depth, clb) {
		var newDepth = depth + depth;
		db.query('select $path, @rid, @class, title, in_AuthorOf.out as authors from (traverse out_AuthorOf, in, in_AuthorOf, out from ' + authId + ' while $depth <= ' + newDepth + ' strategy BREADTH_FIRST) where @class = \'Proceeding\' or @class = \'Journal\'').all()
		.then(function(res) {
			if(res.length) {
				var resArray = [];
				var ctr = 0;
				//XXX: gebruik een variabele len ipv telkens de length op te vragen in de conditie
				for (var i = 0; i < res.length; i++) {
					constructResObjects(res, i, resArray, function(error, bool) {
						//XXX: gebruik === ipv ==
						//XXX: gebruik hier dan ook len
						if(++ctr == res.length) {
							clb(null, resArray);
						}
					});
				};
			}
			else {
				db.record.get(authId)
				.then(function(res) {
					getUsername(authId, function(error,usrname) {
						clb(null, {firstname: res.firstName, lastName: res.lastName, id: RID.getRid(res), username: usrname});
					})
				//XXX: geef mijn callback direct mee
				}).error(function(er) {
					clb(er);
				});
			}
		//XXX: idem
		}).error(function(er) {
			clb(er);
		});
	}
}

exports.Graph = Graph;