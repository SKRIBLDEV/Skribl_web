


function ResearchDomain(db){


	/**
	 * returns the record id of an object as a string.
	 * @private
	 * @param  {Object} object
	 * @return {String}
	 */
	function getRid(object) {
		var rid = object['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	/**
	 * gets rid in object form and transforms it into stringform
	 * @private
	 * @param  {Object} data
	 * @return {String}
	 */
	function transformRid(data) {
		var cluster = data.cluster;
		var position = data.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}


		/**
	 * adds a researchdomain with given name
	 * @private
	 * @param {String}   domain
	 * @param {callBack} callback
	 */
	function addResearchDomain(domain, callback) {
		var domName = domain;
		db.select().from('ResearchDomain').where({Name: domName}).all()
		.then(function(domains) {
			if(domains.length) {
				var domain = domains[0];
				var domainRid = getRid(domain);
				callback(null, domainRid);
			}
			else {
				db.vertex.create({
				'@class': 'ResearchDomain',
				Name: domName})
				.then(function (ResearchDomain) {
					var domainRid = getRid(ResearchDomain);
					callback(null, domainRid);
				});
			}
		});
	}

	this.addResearchDomains = function(domains, userRid, callback) {
		var counter = domains.length;
		counter--;
		function forClb(error, domainRid) {
				if(error) {
					callback(error);
				} else {
					db.edge.from(userRid).to(domainRid).create('HasResearchDomain')
					.then(function() {
						if(counter) {
							counter--;
						}
						else {
							callback(null, true);
						}
					});
				}
			}

		for (var i = 0; i < domains.length; i++) {
			addResearchDomain(domains[i], forClb);
		}
	}
}

exports.ResearchDomain = ResearchDomain;