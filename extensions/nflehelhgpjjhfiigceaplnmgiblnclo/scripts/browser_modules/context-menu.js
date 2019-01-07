var common = require('common');

//var MENU_CONTEXTS = ['link', 'image', 'video', 'audio', 'frame'];
var MENU_CONTEXTS = ['all'];

var noop = function() {};
var nullify = function(fn) {
	return function() {
		fn();
	};
};

var findItem = function(items, item) {
	for(var i = 0; i < items.length; i++) {
		var it = items[i];

		if(it === item) {
			return i;
		}
	}

	return -1;
};

var MenuItem = function(title, options) {
	options = options || {};

	this.id = null;
	this.parent = null;
	this.name = options.name;

	delete options.name;

	this._options = common.join({ title: title, contexts: MENU_CONTEXTS }, options);
	this._children = [];
};

MenuItem.separator = function() {
	var sep = new MenuItem(null, { type: 'separator' });

	delete sep._options.title;

	return sep;
};

MenuItem.prototype.create = function(callback) {
	if(this.id) {
		throw new Error('Cannot create an already existing item');
	}

	callback = callback || noop;

	var options = common.join(this._options);
	var self = this;

	if(this.parent) {
		options = common.join(options, { parentId: this.parent.id });
	}

	common.step([
		function(next) {
			self.id = chrome.contextMenus.create(options, nullify(next.parallel()));
			
			/*if(!self._children.length) {
				next.parallel()();
				return;
			}*/

			self._children.slice().forEach(function(item) {
				item.create(nullify(next.parallel()));
			});
		},
		function() {
			callback();
		}
	])
};
MenuItem.prototype.destroy = function(callback) {
	if(!this.id) {
		throw new Error('Cannot destroy non existing item');
		//return;
	}

	if(this.parent) {
		this.parent.remove(this);
		this.parent = null;
	}

	var id = this.id;
	
	this.id = null;
	this._children = [];

	chrome.contextMenus.remove(id, callback);
};
MenuItem.prototype.get = function(name) {
	return this._children.filter(function(item) {
		return item.name === name;
	})[0];
};
MenuItem.prototype.add = function(item) {
	if(item.id) {
		throw new Error('Item already created');
	}

	item.parent = this;
	this._children.push(item);
};
MenuItem.prototype.remove = function(item) {
	var index = findItem(this._children, item);

	if(index === -1) {
		throw new Error('Given item is not child of this item');
	}

	this._children.splice(index, 1);
};

var MenuItemGroup = function(options) {
	this.parent = null;
	this.name = (options || {}).name;

	this._items = [];
};

MenuItemGroup.prototype.__defineGetter__('id', function() {
	return this.parent && this.parent.id;
})
MenuItemGroup.prototype.create = function(callback) {
	this._execute('create', callback)
};
MenuItemGroup.prototype.destroy = function(callback) {
	if(this.parent) {
		this.parent.remove(this);
		this.parent = null;
	}

	this._execute('destroy', callback);
};
MenuItemGroup.prototype.get = function(name) {
	return this._items.filter(function(item) {
		return item.name === name;
	})[0];
};
MenuItemGroup.prototype.add = function(item) {
	item.parent = this;
	this._items.push(item);
};
MenuItemGroup.prototype.remove = function(item) {
	var index = findItem(this._items, item);

	if(index === -1) {
		throw new Error('Given item is not child of this item');
	}

	this._items.splice(index, 1);
};
MenuItemGroup.prototype._execute = function(action, callback) {
	var self = this;

	common.step([
		function(next) {
			if(!self._items.length) {
				next();
				return;
			}

			self._items.slice().forEach(function(item) {
				item[action](nullify(next.parallel()));
			});
		},
		function() {
			(callback || noop)();
		}
	]);
};

exports.createItem = function(title, options) {
	return new MenuItem(title, options);
};
exports.createItemGroup = function(options) {
	return new MenuItemGroup(options);
};
exports.createSeparator = function() {
	return MenuItem.separator();
};
