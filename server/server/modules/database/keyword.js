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
		}).error(clb);
	}

	/**
	 * uses addkeyword to add multiple keywords to database
	 * @param {Array<String>}   keywords array of keywords
	 * @param {Object}   trx      transaction
	 * @param {callback} callback 
	 */				
	this.addKeywords = function(keywords, trx, callback) {
		if(keywords && keywords.length) {
			var keyLength = keywords.length;
 			var ctr = 0;
			for (var i = 0; i < keyLength; i++) {
				addKeyword(keywords[i], i, trx, function(error, res) {
					if(++ctr === keyLength) {
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
				var keyLength = resKeys.length;
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
			clb(er);
		});
	}

}
exports.Keyword = Keyword;