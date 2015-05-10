

const RID = require('./rid.js');
function ResearchDomain(db){


	/**
	 * adds researchDomain with given name.
	 * @param {String}   domain   name of domain
	 * @param {String or Int}   varName  helps identify domain when multiple are created in same transaction
	 * @param {Object}   trx      transaction object
	 * @param {callBack} callback
	 * @return {String or Int} returns varName
	 */
	function addResearchDomain(domain, varName, trx, callback) {
		db.select().from('ResearchDomain').where({major: domain.major, minor: domain.minor}).all()
		.then(function(domains) {
			if(domains.length) {
				trx.let('resDomain' + varName, function(s) {
					s.select().from('ResearchDomain').where({major: domain.major, minor: domain.minor});
				})
				callback(null, varName);
			}
			else {
				trx.let('resDomain' + varName, function(s) {
					s.create('vertex', 'ResearchDomain')
					.set({
						major: domain.major,
						minor: domain.minor
					});
				});
			callback(null, varName);
			}
		}).error(callback);
	}

	/**
	 * will iterate over given domains and call addResearchDomains
	 * @param {Array<String>}   domains  ResearchDomains
	 * @param {String}   userRid  
	 * @param {callBack} callback
	 */
	db.addResearchDomains = function(domains, trx, callback) {
		var counter = domains.length - 1;
		function forClb(error, varName) {
				if(error) {
					callback(error);
				} 
				else {
					trx.let('domainEdge', function(s) {
						s.create('edge', 'HasResearchDomain')
						.from('$user')
						.to('$resDomain' + varName);
					});
					if(counter) {
						counter--;
					}
					else {
						callback(null, true);
					}
				}
			}

		for (var i = 0; i < domains.length; i++) {
			addResearchDomain(domains[i], i, trx, forClb);
		}
	};

	/**
	 * creates researchdomains and connects them to a publication
	 * @param {Array<String>}   domains  array of domains to be added/connected
	 * @param {Object}   trx      transaction
	 * @param {callBack} callback 
	 */
	db.addPubResearchDomains = function(domains, trx, callback) {
		var ctr = 0;
		function forClb(error, varName) {
			ctr++;
			if(error) {
				callback(error);
			} 
			else {
				trx.let('domainEdge', function(s) {
					s.create('edge', 'HasResearchDomain')
					.from('$publication')
					.to('$resDomain' + varName);
				});
				if(ctr === domains.length) {
					callback(null, true);
				}
			}
		}
		if(domains && domains.length) {
			for (var i = 0; i < domains.length; i++) {
				addResearchDomain(domains[i], i, trx, forClb);
			}
		}
		else {
			callback(null, true);
		}
	};

	/**
	 * gets all connected researchdomains of a publication
	 * @param  {String} pubId id of publication
	 * @param  {callBack} clb   
	 * @return {Array<String>}       array of researchdomains
	 */
	db.getPubResearchDomains = function(pubId, clb) {
		db.select('expand( out(\'HasResearchDomain\') )').from(pubId).all()
		.then(function(resDomains) {
			var resDomLength = resDomains.length;
			if(resDomLength) {
				var res = new Array(resDomLength);
				//XXX: ofwel nog beter, een map
				for (var i = 0; i < resDomLength; i++) {
					var currDom = resDomains[i];
					res[i] = {major: currDom.major, minor: currDom.minor};
				};	
				clb(null, res);
			}
			else {
				clb(null, []);
			}
		}).error(clb);
	}
}

exports.ResearchDomain = ResearchDomain;