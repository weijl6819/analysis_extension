Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'
Backbone.$ = $
Pages = require '../../shared/javascript/views/pages.coffee'

module.exports = class TabManager extends Backbone.View

  initialize: ->
    console.debug "[tab manager] Initializing."

    chrome.storage.sync.get ['accessToken', 'host'], (settings) =>
      window.pages = @pages = new Pages settings

    chrome.runtime.onMessage.addListener @onMessage
    chrome.storage.onChanged.addListener @storageChange
    chrome.pageAction.onClicked.addListener @click
    chrome.tabs.onActivated.addListener @activated

  storageChange: (changes) =>
    return unless @pages
    {host, accessToken} = changes
    @pages.authenticate(host: host?.newValue, accessToken: accessToken?.newValue)

  onMessage: (request, sender, sendResponse) =>
    return unless @pages
    {route, url} = request
    {tab} = sender
    return unless /^http/.test url

    switch route
      when 'bookmark'
        @click tab

      when 'index'
        {head, body, title} = request

        console.debug "[tab manager] processing #{url}"

        page = @pages.add tab.id, {url, head, body, title}

        @listenTo page, 'refresh', @refresh
        @listenTo page, 'error', @error
        @listenTo page, 'related', @related

        page.save()

  click: (tab) =>
    @pages?.get(tab.id)?.toggleBookmark()

  related: (documents, page) =>
    chrome.tabs.sendMessage page.id, documents, (response) ->
      console.log response

  activated: (tab) =>
    @pages?.get(tab.tabId)?.fetch()

  refresh: (page) =>
    bookmarked = page.model.get 'bookmarked'
    {id} = page
    console.debug "[tab manager] Refreshing tab #{id}"

    chrome.pageAction.show id
    chrome.pageAction.setIcon
      tabId: id
      path: if bookmarked
        '/icons/star-full-38.png'
      else
        '/icons/star-empty-38.png'

  error: (page, response) ->
    chrome.pageAction.show page.id
    chrome.pageAction.setIcon
      tabId: page.id
      path: '/icons/error-38.png'