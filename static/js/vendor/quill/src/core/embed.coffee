_          = require('lodash')
Delta      = require('rich-text/lib/delta')
dom        = require('../lib/dom')
Format     = require('./format')
Leaf       = require('./leaf')
Line       = require('./line')
LinkedList = require('../lib/linked-list')
Normalizer = require('../lib/normalizer')


class Embed extends Line
  @CLASS_NAME : 'ql-embed'
  @ID_PREFIX  : 'ql-embed-'

  constructor: (@doc, @node, type, data) ->
    @isEmbed = true
    this._initController(type, data)
    @node.setAttribute('contenteditable', false)
    this._clickListener()
    super(@doc, @node, Embed)

  _clickListener: =>
    dom(@node).on('click', =>
      @doc.editor.selection.selectEmbed(this)
    )

  _initController: (type, data) =>
    return unless _.isString(type)
    controller = @doc.editor.quill.getEmbed(type).controller
    initialState = {
      type: type,
      data: data
    }
    @controller = controller(@node, initialState)

  getJSON: ->
    return false unless typeof @controller != 'undefined'
    return @controller.getJSON()

  optimize: ->
    this.rebuild()

  rebuild: (force = false) ->
    this.resetContent()
    return true

  resetContent: ->
    @node.id = @id unless @node.id == @id
    @outerHTML = @node.outerHTML
    @length = 1
    @delta = new Delta()

module.exports = Embed
