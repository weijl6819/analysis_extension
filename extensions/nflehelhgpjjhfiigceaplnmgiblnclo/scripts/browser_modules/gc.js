var gc = function(emitter) {
	var arr = [function() {
		emitter.removeListener('newListener', cleaner);
	}];
	var cleaner = function(name, fn) {
		arr.push(function() {
			emitter.removeListener(name, fn);
		});
	};

	emitter.on('newListener', cleaner);

	return function(removeAll) {
		while ((removeAll && arr.length) || arr.length > 1) {
			arr.pop()();
		}
	};
};

var GarbageCollector = function() {
	this._cleaners = [];
};

GarbageCollector.prototype.register = function(emitters) {
	var self = this;

	if(!Array.isArray(emitters)) {
		emitters = Array.prototype.map.call(arguments, function(arg) {
			return arg;
		});
	}

	emitters.forEach(function(emitter) {
		self._cleaners.push(gc(emitter));
	});
};

GarbageCollector.prototype.free = function() {
	for(var i in this._cleaners) {
		this._cleaners[i]();
	}
};

GarbageCollector.prototype.clean = function() {
	while(this._cleaners.length) {
		this._cleaners.pop()(true);
	}
};

exports.create = function() {
	var gc = new GarbageCollector();

	return gc;
};
