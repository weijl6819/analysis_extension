Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'
Backbone.$ = $

Form = require '../../shared/javascript/views/form.coffee'
Error = require '../../shared/javascript/views/error.coffee'

class PopupView extends Backbone.View

  initialize: (options) ->
    console.debug "[popup] Initializing"

    {pages} = options
    currentTab = active: yes, currentWindow: yes

    chrome.tabs.query currentTab, (tabs) =>
      tab = tabs[0]
      console.log 'currentTab', tabs
      return unless page = pages?.get tab.id

      @listenTo page, 'error', @error

      page.bookmark() # bookmark only on click
      @$el.append (new Form {page}).render().el unless page.isNew()

  error: (page, error) ->
    @$el.html (new Error {error}).render().el

$(document).ready ->
  chrome.runtime.getBackgroundPage (background) ->
    {pages} = background
    (new PopupView {el: $('#main'), pages}).render()