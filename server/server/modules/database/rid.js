var Oriento = require('oriento');

	/**
	 * returns the record id of an object as a string.
	 * @private
	 * @param  {Object} object
	 * @return {String}
	 */
	exports.getRid = getRid;
	function getRid(object) {
		var rid = object['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	exports.getORid = getORid;

	function getORid(object) {
		var rid = object['@rid'];
		var cluster = rid.cluster;
		var position = rid.position;
		var result = '#' + cluster + ':' + position;
		return Oriento.RID(result);
	}

	/**
	 * gets rid in object form and transforms it into stringform
	 * @private
	 * @param  {Object} data
	 * @return {String}
	 */
	exports.transformRid = transformRid;
	function transformRid(data) {
		var cluster = data.cluster;
		var position = data.position;
		var result = '#' + cluster + ':' + position;
		return result;
	}

	exports.getRids = function(array) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(getRid(array[i]));
			counter++
			if(counter == array.length) {
				return resArray;
			}
		};
	}

	exports.getFieldRids = function(array) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(transformRid(array[i].rid));
			counter++
			if(counter == array.length) {
				return resArray;
			}
		};
	}

	exports.getORids = function(array) {
		var resArray = [];
		var counter = 0;
		for (var i = 0; i < array.length; i++) {
			resArray.push(getORid(array[i]));
			counter++
			if(counter == array.length) {
				return resArray;
			}
		};
	}

	exports.compareRid = function(rid1, rid2) {
		rid1 = rid1.replace('#', '');
		rid2 = rid2.replace('#', '');
		rid1 = rid1.replace(':', '');
		rid2 = rid2.replace(':', '');
		return parseInt(rid1) - parseInt(rid2);
	}