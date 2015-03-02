

	/**
	 * returns the record id of an object as a string.
	 * @private
	 * @param  {Object} object
	 * @return {String}
	 */
	exports.getRid = function(object) {
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
	exports.transformRid = function(data) {
		var cluster = data.cluster;
		var position = data.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	exports.getRids = function(array, clb) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(getRid(array[i]));
			counter++
			if(counter == array.length) {
				clb(null, resArray);
			}
		};
	}