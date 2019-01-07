(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function initialize(t,e){filterMode=t,filteredEmotesCount=e.length;for(var i=0;i<e.length;++i)"Twitch.tv"===e[i].set?filteredEmotes.twitch.push(e[i]):"BetterTTV"===e[i].set?filteredEmotes.bttv.push(e[i]):"FrankerFaceZ"===e[i].set&&filteredEmotes.ffz.push(e[i])}function isEmoteAllowed(t,e){var i=!0;if(filteredEmotesCount>0){i=null===getMatchingFilterRule(t,e),"Whitelist"===filterMode&&(i=!i)}return i}function getMatchingFilterRule(t,e){for(var i=getMatchingFilterSet(t),l=null,r=0;r<i.length;++r){var f=i[r];if(f.value===e){l=f;break}}return l}function getMatchingFilterSet(t){var e=filteredEmotes.twitch;return 0===t.indexOf("bttv")?e=filteredEmotes.bttv:0===t.indexOf("ffz")&&(e=filteredEmotes.ffz),e}var filterMode,filteredEmotesCount,filteredEmotes={twitch:[],bttv:[],ffz:[]};module.exports={initialize:initialize,isEmoteAllowed:isEmoteAllowed};
},{}],2:[function(require,module,exports){
function handleMessage(e){"settings"===e.header?emoteFilter.initialize(e.payload.emoteFilterMode,e.payload.emoteFilterList):"emotes"===e.header?emoteLibrary=e.payload:"search"===e.header&&postMessage({header:"searchResults",payload:{searchID:e.payload.searchID,results:searchForEmotes(e.payload.text,!1===TWITCH_TV_MATCHING_REGEX.test(e.payload.hostname))}})}function searchForEmotes(e,a){var t,r=[];for(STRING_SEPARATOR.lastIndex=0;null!==(t=STRING_SEPARATOR.exec(e));){var o=t[0];for(var i in emoteLibrary)if(emoteLibrary.hasOwnProperty(i)){if(-1!==i.indexOf("twitchChannels")&&!1===a)continue;var s=emoteLibrary[i].emotes;if(s.hasOwnProperty(o)){var n=s[o];if(!0===emoteFilter.isEmoteAllowed(i,o)){r.push({index:t.index,emote:o,url:n.url,emoji:n.emoji,channel:n.channel});break}}}}return r}var emoteFilter=require("./emoteFilter");const STRING_SEPARATOR=/([\w]|[:;)(\\\/<>73#\|\]])+/g,TWITCH_TV_MATCHING_REGEX=/\btwitch\.tv/i;var emoteLibrary={};onmessage=function(e){handleMessage(e.data)};
},{"./emoteFilter":1}]},{},[2]);
