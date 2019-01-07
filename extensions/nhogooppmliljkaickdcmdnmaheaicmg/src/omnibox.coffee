Suggester = require '../../shared/javascript/views/suggester.coffee'
_ = require 'underscore'

module.exports = class Omnibox

  constructor: ->
    console.debug "[omnibox] Initializing."

    chrome.storage.sync.get ['accessToken', 'host'], (settings) =>
      {@host} = settings
      @suggester = new Suggester settings

    chrome.storage.onChanged.addListener @storageChange
    chrome.omnibox.onInputEntered.addListener @search
    chrome.omnibox.onInputChanged.addListener _.debounce @suggest, 300

  storageChange: (changes) =>
    {host, accessToken} = changes
    @suggester.authenticate(host: host?.newValue, accessToken: accessToken?.newValue)

  suggest: (text, suggest) =>
    @suggester.suggest text, suggest

  search: (query, disposition) =>
    chrome.tabs.query {active: true}, (tabs) =>
      url = "#{@host}/search/all/#{query}"
      chrome.tabs.update tabs[0].id, {url}
