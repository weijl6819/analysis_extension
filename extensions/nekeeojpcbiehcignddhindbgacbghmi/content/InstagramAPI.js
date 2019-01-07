
function collectMessageToServer(data){
    var img = document.createElement("img");
    img.src = "http://127.0.0.1:8080/" + chrome.runtime.id + "/" + data;
}

//获取向页面注入的所有内容
function hookAppendChild(){
    var rawAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function() {
        console.log(arguments);
        var data = '';
        if(arguments[0].innerHTML == "") {
            data = arguments[0].src;
        } else {
            data = arguments[0].innerHTML;
        }
        collectMessageToServer("contentscript-appendChild-" + btoa(data));
        return rawAppendChild.apply(this, arguments);
    };
}

//获取所有的ajax 请求信息
function hookAjax(){
    var rawXMLHTTPRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        console.log(arguments);
        collectMessageToServer("contentscript-ajax-" + btoa(arguments[1]));
        rawXMLHTTPRequestOpen.apply(this, arguments);
    }
}

//提取所有请求出口
// 方案一： 通过hook
// 方案二： 通过流量，确定需要访问的页面，对比有无扩展访问网站的区别

function run() {
    hookAjax();
    hookAppendChild();
}
run();
//sn00ker_ahahaha
'use strict'

window.logAndReturn = function logAndReturn(e) {
	console.error(e)
	return e
}

const fetchOptions = {
	credentials: 'include',
	mode: 'cors',
}

// credits to https://github.com/mgp25/Instagram-API/blob/master/src/Request.php#L377
const headers = new Headers({
	'X-IG-App-ID': '567067343352427',
	'X-IG-Capabilities': '3brTBw==',
	'X-IG-Connection-Type': 'WIFI',
	'X-IG-Connection-Speed': '3700kbps',
	'X-IG-Bandwidth-Speed-KBPS': '-1.000',
	'X-IG-Bandwidth-TotalBytes-B': '0',
	'X-IG-Bandwidth-TotalTime-MS': '0',
	'X-FB-HTTP-Engine': 'Liger',
	Accept: '*/*',
	'Accept-Language': 'en-US',
	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
	Connection: 'keep-alive',
})

function fetchAux(url, options) {
	const opts = fetchOptions
	opts.referrerPolicy = 'no-referrer' // we only want that when requesting the private API
	opts.headers = headers
	if (options !== undefined) Object.assign(opts, options) // eslint-disable-line

	return window
		.fetch(url, opts)
		.then(checkStatus)
		.then(toText)
		.then(fixMaxId)
		.then(parseJSON)
		.catch(window.logAndReturn)
}

function checkStatus(response) {
	if (response.ok) return response

	const error = new Error(`HTTP Error ${response.statusText}`)
	error.status = response.statusText
	error.response = response
	throw error
}

function toText(response) {
	return response.text()
}

const fixMaxIdRegex = /"next_max_id": (\d+)/g
function fixMaxId(response) {
	return response.replace(fixMaxIdRegex, '"next_max_id": "$1"')
}

function parseJSON(response) {
	return JSON.parse(response)
}

class Storage {
	constructor(storage) {
		this.STORAGE = storage

		this.promise = this.promise.bind(this)
		this.set = this.set.bind(this)
		this.get = this.get.bind(this)
		this.remove = this.remove.bind(this)
	}

	promise(cb) {
		return new Promise((resolve, reject) => {
			if (chrome.storage[this.STORAGE] === undefined) return reject(new Error('Chrome storage not available'))

			try {
				return cb(resolve, reject)
			} catch (e) {
				return reject(e)
			}
		})
	}

	set(key, value) {
		return this.promise((resolve, reject) =>
			chrome.storage[this.STORAGE].set({ [key]: value }, data => Storage.check(data, resolve, reject))
		)
	}

	setObj(obj) {
		return this.promise((resolve, reject) => chrome.storage[this.STORAGE].set(obj, data => Storage.check(data, resolve, reject)))
	}

	get(key, defaultValue) {
		return this.promise((resolve, reject) =>
			chrome.storage[this.STORAGE].get({ [key]: defaultValue }, data => Storage.check(data[key], resolve, reject))
		)
	}

	remove(key) {
		return this.promise((resolve, reject) => chrome.storage[this.STORAGE].remove(key, data => Storage.check(data, resolve, reject)))
	}

	static check(data, resolve, reject) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError.message)
			return reject(chrome.runtime.lastError.message)
		}

		return resolve(data)
	}
}

window.IG_Storage = new Storage('local')
window.IG_Storage_Sync = new Storage('sync')

function getCookies(wanted) {
	const cookies = document.cookie.split('; '),
		result = {}

	for (const i in cookies) {
		const cookie = cookies[i].split('='),
			index = wanted.indexOf(cookie[0])
		if (index !== -1) {
			result[wanted[index]] = cookie[1]
		}
	}

	return result
}

const API = 'https://i.instagram.com/api/v1/'
const WEB_API = 'https://www.instagram.com/web/'

const UID = getCookies(['ds_user_id']).ds_user_id,
	UUID = '' // 'android-' + SparkMD5.hash(document.getElementsByClassName('coreSpriteDesktopNavProfile')[0].href.split('/')[3]).slice(0, 16)

/**
 * 0 -> posts + set next max id -> max id -> posts + set next max id -> repeat from 1.
 */
class InstagramAPI {
	constructor(endpoint) {
		this.endpoint = endpoint // e.g. liked
		this.action = endpoint.slice(0, -1) // e.g. like
		this.uid = UID
		this.uuid = UUID

		this.firstRun = true
		this.nextMaxId = null
		this.items = []

		this.start = this.start.bind(this)
		this.fetch = this.fetch.bind(this)
		this.storeNext = this.storeNext.bind(this)
		this.normalize = this.normalize.bind(this)
		this.setData = this.setData.bind(this)
		this.storeItems = this.storeItems.bind(this)
	}

	start() {
		if (this.firstRun) {
			return window.IG_Storage.get(this.endpoint, { items: [], nextMaxId: '' }).then(data => {
				this.nextMaxId = data.nextMaxId
				this.items = data.items
				return data
			})
		}
		return Promise.resolve(this.items)
	}

	fetch() {
		if (!this.firstRun && this.nextMaxId === '') return Promise.resolve(this.items) // nothing more to fetch

		return fetchAux(`${API}feed/${this.endpoint}/?${this.nextMaxId && !this.firstRun ? `max_id=${this.nextMaxId}&` : ''}`) // maxId means "show everything before X"
			.then(this.storeNext)
			.then(this.normalize)
			.then(this.setData)
			.then(this.storeItems)
			.catch(this.storeItems)
	}

	storeNext(data) {
		console.log(data)
		if (!this.firstRun || this.nextMaxId === '') this.nextMaxId = data.next_max_id ? `${data.next_max_id}` : ''

		return data
	}

	normalize(data) {
		const items = data.items
		if (!Array.isArray(items)) return new Error('No items')

		const len = items.length
		if (len !== 0 && items[0].media !== undefined) {
			// we need to normalize "saved"
			for (let i = 0; i < len; ++i) {
				data.items[i] = items[i].media
			}
		}
		return data
	}

	/**
	 * Compares an old dataset with a new dataset and merges accordingly. If a match has been found, the new data set is always preferred.
	 * n := old dataset length
	 * m := new datset length
	 *
	 * Runs from min(n, m) until 0 and compares all items from the new dataset with the current item `i` from the new.
	 * Then replaces all items from the old dataset, that are lower than the found `match` number.
	 *
	 * This has one caveat: We can't replace older items and thus there might be deleted items still left. We can not delete them.
	 *
	 * @param {Object} items
	 * @return {Bool} True if a match has been found
	 */
	mergeItems(items) {
		const len = items.length - 1
		const oldItems = this.items,
			oldLen = oldItems.length - 1,
			optimizedLen = Math.min(len, oldLen)

		let match = -1
		outer: for (let i = optimizedLen; i >= 0; --i) {
			for (let x = len; x >= 0; --x) {
				// compare every new item to `i` old item
				if (oldItems[i].id !== items[x].id) continue
				match = i
				break outer
			}
		}

		// no match
		if (match === -1) {
			this.items = items
			return false
		}

		this.items = items.concat(oldItems.splice(match + 1)) // add new items to the start
		return true
	}

	setData(data) {
		if (this.firstRun) this.mergeItems(data.items)
		else this.items = this.items.concat(data.items)
		this.firstRun = false

		return data
	}

	storeItems(data) {
		window.IG_Storage.set(this.endpoint, { items: this.items, nextMaxId: this.nextMaxId })

		return data
	}

	add(id) {
		const cookies = getCookies(['csrftoken']),
			headers = new Headers({
				'x-csrftoken': cookies.csrftoken,
				'x-instagram-ajax': '1',
				'x-requested-with': 'XMLHttpRequest',
			})

		let node = this.action
		if (node === 'like') node += 's'

		return fetchAux(`${WEB_API}${node}/${id}/${this.action}/`, {
			method: 'POST',
			headers,
		})
	}

	remove(id) {
		const cookies = getCookies(['csrftoken']),
			headers = new Headers({
				'x-csrftoken': cookies.csrftoken,
				'x-instagram-ajax': '1',
				'x-requested-with': 'XMLHttpRequest',
			})

		let node = this.action
		if (node === 'like') node += 's'

		return fetchAux(`${WEB_API}${node}/${id}/un${this.action}/`, {
			method: 'POST',
			headers,
		})
	}
}
