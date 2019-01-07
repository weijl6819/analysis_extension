var common = require('common');

var UserOptions = common.emitter(function(defaults) {
	var opts = localStorage.getItem('userOptions');

	this._options = opts ? JSON.parse(opts) : {};

	if(defaults) {
		for(var name in defaults) {
			var value = this._options[name];

			this._options[name] = typeof value === 'undefined' ? defaults[name] : value;
		}

		this._writeOptions();
	}
});

UserOptions.prototype.bootstrap = function(opts) {
	opts = common.join(this._options, opts || {});

	this.emit('change', opts);
};
UserOptions.prototype.keys = function() {
	return Object.keys(this._options);
};
UserOptions.prototype.set = function(name, value) {
	var old = this._options[name];

	if(old !== value) {
		this._options[name] = value;
		this._writeOptions();

		this.emit('change', this._options);
	}
};
UserOptions.prototype.get = function(name) {
	return this._options[name];
};
UserOptions.prototype._writeOptions = function() {
	localStorage.setItem('userOptions', JSON.stringify(this._options));
};

exports.create = function(defaults) {
	return new UserOptions(defaults);
};
