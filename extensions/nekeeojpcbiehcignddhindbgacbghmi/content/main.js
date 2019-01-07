
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
const docEl = document.documentElement,
	$ = e => {
		return document.querySelector(e)
	},
	WIDTH = window.innerWidth

/** Stores the current options */
let OPTIONS

function injectCSS(file) {
	let style = document.createElement('link')

	style.id = 'ige_style'
	style.rel = 'stylesheet'
	style.href = chrome.extension.getURL(`content/${file}.css`)
	document.head.appendChild(style) // inserted css is always non-blocking
	style = null
}
injectCSS('content') // inject as early as possible

// block middle mouse button
window.addEventListener(
	'click',
	e => {
		return e.button > 0 ? e.stopPropagation() : undefined
	},
	true
)

// prevent vid restart
window.addEventListener(
	'blur',
	e => {
		return e.stopPropagation()
	},
	true
)
window.addEventListener(
	'visibilitychange',
	e => {
		return e.stopPropagation()
	},
	true
)

/**
 * Creates a new observer, starts observing and returns the observer.
 *
 * @param {Node} elem Element to observe
 * @param {MutationCallback} fn Mutation Callback
 * @param {MutationOptions} options Options
 * @return {MutationObserver} Callback
 */
function observe(elem, fn, options) {
	const observer = new MutationObserver(fn)

	if (elem) observer.observe(elem, options)

	return {
		observe(el) {
			observer.observe(el, options) // MutationObservers have no unobserve, so we just return an observe function.
		},
		disconnect() {
			observer.disconnect()
		},
	}
}

/**
 * Observe for node changes and add video controls if needed.
 */
const root = document.getElementById('react-root')

observe(
	document.body,
	mutations => {
		for (const i in mutations) {
			const mutation = mutations[i],
				added = mutation.addedNodes

			for (const x in added) {
				const el = added[x]

				Promise.resolve()
					.then(handleNode.bind(undefined, el, mutation))
					.catch(window.logAndReturn)
			}
		}
	},
	{ childList: true, subtree: true }
)

const handleNodeFns = {
	DIV(node) {
		node.querySelectorAll('img').forEach(fullPhoto)
		node.querySelectorAll('video').forEach(addControls)
	},
	ARTICLE(node) {
		handleNodeFns.DIV(node)
	},

	VIDEO: addControls,
	IMG: fullPhoto,

	SECTION(node) {
		handleNodeFns.DIV(node)
	},
}

function handleNode(node, mutation) {
	const nodeName = node.nodeName

	if (mutation.target.id === 'react-root' && nodeName === 'SECTION') onChange()
	handleNodeFns[nodeName] !== undefined && handleNodeFns[nodeName](node)
}

let hasNavigated = false,
	prevUrl = location.href,
	currentClass = ''

/**
 * Checks the URL for changes.
 */
function checkURL() {
	if (location.href !== prevUrl) {
		prevUrl = location.href
		hasNavigated = true
		onNavigate()
	}
}

/**
 * Sets the correct currentClass.
 *
 * .home on the main homepage
 * .profile on user profiles
 * .post when a single post is open (also as modal)
 * .explore if the explore tab is open
 * .stories when stories are open
 */
function decideClass() {
	const pathname = location.pathname

	if (
		(hasNavigated &&
			(location.search.indexOf('tagged') !== -1 ||
				location.search.indexOf('taken-by=') !== -1)) ||
		$('body > div > div[role="dialog"]') !== null
	)
		return (currentClass = '')

	// home page
	if (pathname === '/') return (currentClass = 'home')

	// stories
	if (pathname.indexOf('/stories/') !== -1) return (currentClass = 'stories')

	// single post
	if (pathname.indexOf('/p/') !== -1) return (currentClass = 'post')

	// search results
	if (pathname.indexOf('/explore/') !== -1) return (currentClass = 'explore')

	// profile page
	return (currentClass = 'profile')
}

function addClass() {
	if (currentClass === '' || root.classList.contains(currentClass)) return

	root.classList.remove('home', 'profile', 'post', 'explore', 'stories')
	root.classList.add(currentClass)
}

const Instagram = {
	liked: new InstagramAPI('liked'),
	saved: new InstagramAPI('saved'),
}

function addExtendedButton() {
	if ($('.extended--btn') !== null) return

	let $anchor = document.querySelectorAll('nav div > a:only-child')

	if ($anchor.length === 0) {
		console.warn('Nav Selector outdated')
		return
	}

	$anchor = $anchor[$anchor.length - 1].parentNode
	const el = $anchor.cloneNode(true),
		a = el.firstChild

	a.className = ''
	a.classList.add('extended--btn')

	let clickedExtendedBtn = true

	if (window.localStorage.clickedExtendedBtn === undefined) {
		a.classList.add('extended--btn__new')
		clickedExtendedBtn = false
	}

	a.href = '#'
	a.nodeValue = '' // clear content
	a.textContent = '⋯'
	a.title = 'Improved Layout for Instagram'
	a.addEventListener('click', function(e) {
		e.preventDefault()

		Instagram.liked
			.start()
			.then(Instagram.liked.fetch)
			.catch(window.logAndReturn)
		Instagram.saved
			.start()
			.then(Instagram.saved.fetch)
			.catch(window.logAndReturn)

		chrome.runtime.sendMessage(null, { action: 'click' })
		if (!clickedExtendedBtn) window.localStorage.clickedExtendedBtn = true
	})
	$anchor.after(el)
}

const listenerActions = {
	load(request) {
		return Instagram[request.which].fetch()
	},

	_action(request) {
		return (
			Instagram[request.which][request.action] !== undefined &&
			Instagram[request.which][request.action](request.id)
		)
	},

	add(request) {
		return this._action(request)
	},

	remove(request) {
		return this._action(request)
	},
}

function addListener() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if (
			listenerActions[request.action] !== undefined &&
			Instagram[request.which] !== undefined
		) {
			listenerActions[request.action](request)
		}
	})
}

const vlSelector =
	'main > section > div:first-child:not(#rcr-anchor) ~ div:last-child > div + div > div + div > div > div > div'

function addNamesToStories() {
	const list = document.querySelectorAll(
			vlSelector + ' button > div + div span'
		),
		regex = /\./g,
		len = list.length

	if (len === 0) {
		console.warn('Stories Name Selector outdated')
		return
	}

	for (let i = 0; i < len; ++i) {
		const elem = list[i]

		elem.parentElement.parentElement.parentElement.parentElement.id = `igs_${elem.firstChild.data.replace(
			regex,
			'dot'
		)}` // faster than .textContent
	}
}

const connection = navigator.connection.type,
	speed = navigator.connection.downlink,
	fullSizeCondition = connection === 'wifi' && speed > 1.9,
	fullsizeObserver = observe(
		undefined,
		mutations => {
			for (const i in mutations) {
				const mutation = mutations[i].target

				if (mutation.sizes !== '1080px') mutation.sizes = '1080px'
			}
		},
		{ attributes: true, attributeFilter: ['sizes'] }
	)

/**
 * Free observers to prevent memory leaks.
 */
function disconnectObservers() {
	fullsizeObserver.disconnect()
}

/**
 *
 * @param {HTMLImageElement} el Image
 */
function fullPhoto(el) {
	if (!el) return

	el.decoding = 'async'
	if (fullSizeCondition) {
		// @todo: Make sure this also happens on first time load on a profile
		el.sizes = '1080px'
		fullsizeObserver.observe(el)
	}
}

/**
 * Adds controls to videos and preloads if needed.
 *
 * @param {HTMLVideoElement} el Video
 */
function addControls(el) {
	if (!el) return

	el.controls = 'true'
	if (fullSizeCondition) el.preload = 'auto'
}

function setBoxWidth(i) {
	docEl.style.setProperty('--boxWidth', `${i}vw`)
}

function toggleWatchlist(user) {
	if (!OPTIONS.watchPosts) OPTIONS.watchPosts = [user]
	else {
		const i = OPTIONS.watchPosts.indexOf(user)

		i === -1 ? OPTIONS.watchPosts.push(user) : OPTIONS.watchPosts.splice(i, 1)
	}
	if (!OPTIONS.watchStories) OPTIONS.watchStories = [user]
	else {
		const i = OPTIONS.watchStories.indexOf(user)

		i === -1
			? OPTIONS.watchStories.push(user)
			: OPTIONS.watchStories.splice(i, 1)
	}

	window.IG_Storage_Sync.set('options', OPTIONS).catch(window.logAndReturn)
}

/**
 * Add a 'watched' label and whether if posts or stories are watched
 */
function addWatched() {
	const user = location.pathname.split('/')[1]

	let $node = $('header div h1')

	if ($node === null || $node.textContent !== user) {
		console.warn('User Selector outdated')
		return
	}

	$node = $node.parentElement.parentElement

	let cls = false,
		text = ''

	if (OPTIONS.watchPosts && OPTIONS.watchPosts.indexOf(user) !== -1) {
		text += 'Posts '
		cls = true
	}
	if (OPTIONS.watchStories && OPTIONS.watchStories.indexOf(user) !== -1) {
		text += 'Stories '
		cls = true
	}

	if (cls) {
		$node.dataset.igeWatched = text
		$node.classList.add('ige_watched')
	} else $node.classList.add('ige_watch')

	$node.addEventListener(
		'click',
		e => {
			const target = e.target

			if (target.nodeName !== 'SECTION') return

			const list = target.classList

			list.toggle('ige_watch')
			list.toggle('ige_watched')

			toggleWatchlist(user)
		},
		false
	)
}

/**
 * Options
 */

/** Options handlers */
const OPTS_MODE = {
	blockStories(value) {
		for (const i in value) {
			document.getElementById(`igs_${value[i]}`).style.display = 'none'
		}
	},
	//highlightOP(arg) {},
	_boxWidth(i) {},
	rows(i) {
		if (i !== 4) setBoxWidth(100 / i - 1)
	},
	boxWidth(i) {
		if (OPTIONS.rows === 2 && i > 25 && i !== 49) setBoxWidth(i)
		if (OPTIONS.rows === 4 && i < 25 && i !== 23) setBoxWidth(i)
	},

	// boolean toggles
	klass(cls) {
		if (!root.classList.contains(cls)) root.classList.add(cls)
	},
	night(arg) {
		const hour = new Date().getHours()

		if (
			(hour >= OPTIONS.nightModeStart && hour > OPTIONS.nightModeEnd) ||
			(hour < OPTIONS.nightModeStart && hour < OPTIONS.nightModeEnd) ||
			OPTIONS.nightModeStart === OPTIONS.nightModeEnd
		)
			injectCSS('night')
	},
	only3Dot(arg) {
		$('#ige_style').remove()
	},
	notify(arg) {
		const now = Date.now(),
			last =
				window.sessionStorage.ige_lastFetch !== undefined
					? +window.sessionStorage.ige_lastFetch
					: 0

		if (now - last > 60000) {
			window.sessionStorage.ige_lastFetch = now
			chrome.runtime.sendMessage(null, { action: 'watchNow' })
		}
	},
}

/**
 * Options mapper.
 */
const OPTS = {
	// blockPosts: null, // []
	blockStories: OPTS_MODE.blockStories, // []
	night: OPTS_MODE.night,
	nightModeStart: undefined,
	nightModeEnd: undefined,
	picturesOnly: OPTS_MODE.klass,
	hideStories: OPTS_MODE.klass,
	noSpaceBetweenPosts: OPTS_MODE.klass,
	hideRecommended: OPTS_MODE.klass,
	highlightOP: OPTS_MODE.highlightOP,
	only3Dot: OPTS_MODE.only3Dot,
	rows: OPTS_MODE.rows,
	rowsFourBoxWidth: OPTS_MODE.boxWidth,
	rowsTwoBoxWidth: OPTS_MODE.boxWidth,

	watchPosts: undefined,
	watchStories: undefined,
	watchInBackground: OPTS_MODE.notify, // Check for updates when opening IG
	// indicateFollowing: true
}

function handleOptions(options) {
	if (options === null) return options
	OPTIONS = options

	for (const optName in options) {
		const oFn = OPTS[optName]

		if (oFn === undefined) continue

		const optValue = options[optName]

		if (typeof optValue === 'boolean') optValue && oFn(`ige_${optName}`)
		else oFn(optValue)
	}

	return options
}

function updateStorage(changes, area) {
	if (changes.options !== undefined) {
		console.log('new options', changes)
		handleOptions(changes.options.newValue)
	}
}

function loadOptions() {
	window.IG_Storage_Sync.get('options', null)
		.then(handleOptions)
		.catch(window.logAndReturn)

	chrome.storage.onChanged.addListener(updateStorage)
}

OPTS_MODE.rows(WIDTH < 1367 ? 2 : 4)

/**
 * Callback when nodes are removed/inserted.
 */
function onChange() {
	checkURL()
}

/**
 * Callback when an url navigation has happened.
 */
function onNavigate() {
	disconnectObservers()
	decideClass()
	window.requestIdleCallback(() => {
		return window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				addClass()

				document.body.querySelectorAll('video').forEach(addControls)
				document.body.querySelectorAll('img').forEach(fullPhoto)

				if (currentClass === 'home') addNamesToStories()
				if (currentClass === 'profile') addWatched()

				addExtendedButton()
			})
		})
	}) // double-rAF
}

/**
 * Callback when DOM is ready.
 */
function onReady() {
	loadOptions()
	onNavigate()

	addListener()
}

if (document.readyState === 'interactive' || document.readyState === 'complete')
	onReady()
else document.addEventListener('DOMContentLoaded', onReady)
