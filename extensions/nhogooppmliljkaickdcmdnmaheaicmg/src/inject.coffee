Helper = require '../../shared/javascript/helper.coffee'

helper = new Helper
processed = no

return if helper.isFetching()

helper.setIndexer (force = no) ->
  return if document.webkitHidden or (processed and not force)
  processed = yes

  chrome.extension.sendMessage
    route: 'index'
    body: document.documentElement.outerHTML
    title: document.title
    url: helper.location()

helper.index()

document.addEventListener 'webkitvisibilitychange', ->
  helper.index()
, false

window.addEventListener 'keydown', (e) ->
  return unless e.metaKey and e.keyCode is 66 # CMD-B
  chrome.extension.sendMessage
    route: 'bookmark'
    url: helper.location()
, false

return unless helper.isGoogle()

chrome.storage.sync.get showRelated: true, (settings) ->
  return unless settings.showRelated

  chrome.runtime.onMessage.addListener (data) ->
    helper.addResults data

  setInterval ->
    helper.monitor yes
  , 200

  true