Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'
Backbone.$ = $
TabManager = require './tab-manager.coffee'
Omnibox = require './omnibox.coffee'
Login = require '../../shared/javascript/login.coffee'

class BackgroundView extends Backbone.View

  initialize: ->
    console.debug "[background] Initializing"

    new Omnibox
    new TabManager

    chrome.runtime.onMessageExternal.addListener @appMessageExternal

  appMessageExternal: (request, sender, sendResponse) =>
    {route, accessToken, host} = request

    switch route
      when 'login'
        console.debug "[background] Login request: #{accessToken} / #{host}"
        chrome.storage.sync.set {accessToken, host}
      when 'logout'
        console.debug "[background] Logout request."
        chrome.storage.sync.set {accessToken: null, host} # host needed for login and other links

$(document).ready ->
  new BackgroundView()