var Oriento = require('oriento');

function Keyword(db, myDB) {

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
			var keyLength = resKeys.length;
			var res = [];
			for (var i = 0; i < keyLength; i++) {
				res.push(resKeys[i].keyword);
			};
			clb(null, res);
		}).error(clb);
	}

}
exports.Keyword = Keyword;