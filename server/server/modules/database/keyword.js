var Oriento = require('oriento');

function Keyword(db, myDB) {

	//XXX: zie opmerking over modules

	/**
	 * adds a keyword to database
	 * @param {String} keyword name of keyword
	 * @param {Integer} trx_id  nr to help distinguish keyword in database
	 * @param {Object} trx     transaction
	 * @param {callBack} clb     
	 */
	function addKeyword(keyword, trx_id, trx, clb) {
		db.select().from('Keyword').where('keyword = \'' + keyword + '\'').all()
		.then(function(res) {
			if(res.length) {
				trx.let(trx_id, function(s) {
					s.select().from('Keyword').where('keyword = \'' + keyword + '\'');
				});
			}
			else {
				trx.let(trx_id, function(s) {
					s.create('vertex', 'Keyword')
					.set({
						keyword: keyword
					});
				});
			}
			trx.let('keywordEdge', function(s) {
				s.create('edge', 'HasKeyword')
				.from('$publication')
				.to('$' + trx_id);
			});
			clb(null, true);
		//XXX: geef direct de callback mee
		}).error(function(er) {
			callback(er);
		});
	}

	/**
	 * uses addkeyword to add multiple keywords to database
	 * @param {Array<String>}   keywords array of keywords
	 * @param {Object}   trx      transaction
	 * @param {callback} callback 
	 */				
	this.addKeywords = function(keywords, trx, callback) {
		//XXX: ipv (typeof ...), gebruik gewoon (keywords && keywords.length)
		if(typeof keywords !== 'undefined' && keywords.length) {
 			var ctr = 0;
 			//XXX: gebruik length in een variabele
			for (var i = 0; i < keywords.length; i++) {
				addKeyword(keywords[i], i, trx, function(error, res) {
					//XXX: 1) gebruik ===
					//XXX: 2) gebruik ++ctr;
					//XXX: 3) gebruik len
					ctr++;
					if(ctr == keywords.length) {
						callback(null, true);
					}
				});
			};		
		}
		else {
			callback(null, true);
		}
	}

	/**
	 * returns all keywords connected to given publication
	 * @param  {String} pubId publication id
	 * @param  {callBack} clb  
	 * @return {Array<String>}       array of keyword names
	 */
	this.getPubKeywords = function(pubId, clb) {
		db.select('expand( out(\'HasKeyword\') )').from(pubId).all()
		.then(function(resKeys) {
			//XXX: if test is hier toch niet nodig, dit wordt al in for-lust getest!
			//XXX: zelfs als je hier map gebruikt...
			if(resKeys.length) {
				var res = [];
				var ctr = 0;
				//XXX: gebruik hier een gewone for lus, ctr & i lopen parallel
				//XXX: gebruik een variabele len voor de length
				//XXX: of gebruik hier reskeys.map(function(el) { return el.keyword }), nog beter ;)
				for (var i = 0; i < resKeys.length; i++) {
					res.push(resKeys[i].keyword);
					ctr++;
					if(ctr == resKeys.length) {
						clb(null, res);
					}
				};	
			}
			else {
				clb(null, []);
			}

		//XXX: geef direct callback mee
		}).error(function(er) {
			callback(er);
		});
	}

}
exports.Keyword = Keyword;