Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'
Backbone.$ = $

class MainView extends Backbone.View

  el: '#container'

  events:
    'change input[type=checkbox]': (e) ->
      chrome.storage.sync.set showRelated: e.target.checked

  initialize: ->
    console.debug '[options] Initializing'

    chrome.storage.onChanged.addListener @render

    chrome.storage.sync.get showRelated: yes, (settings) =>
      @$('#showRelated').attr checked: settings.showRelated

  render: =>
    super

    chrome.storage.sync.get ['accessToken', 'host'], (settings) =>
      loggedIn = !!settings.accessToken
      isLocal = /localhost/.test settings.host

      $('[data-ref=host-link]').attr href: settings.host
      $('#host').val settings.host

      $('.cloud-only').toggleClass 'hidden', isLocal

      $('#loading').addClass 'hidden'

$(document).ready ->
  new MainView(el: $('#container')).render()
