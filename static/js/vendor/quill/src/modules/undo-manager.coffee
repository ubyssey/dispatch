Quill  = require('../quill')
_      = Quill.require('lodash')
Delta  = Quill.require('delta')


class UndoManager
  @DEFAULTS:
    delay: 1000
    maxStack: 100

  @hotkeys:
    UNDO: { key: 'Z', metaKey: true }
    REDO: { key: 'Z', metaKey: true, shiftKey: true }

  constructor: (@quill, @options = {}) ->
    @lastRecorded = 0
    @ignoreChange = false
    this.clear()
    this.initListeners()

  initListeners: ->
    @quill.onModuleLoad('keyboard', (keyboard) =>
      keyboard.addHotkey(UndoManager.hotkeys.UNDO, =>
        @quill.editor.checkUpdate()
        this.undo()
        return false
      )
      keyboard.addHotkey(UndoManager.hotkeys.REDO, =>
        @quill.editor.checkUpdate()
        this.redo()
        return false
      )
    )
    @quill.on(@quill.constructor.events.TEXT_CHANGE, (delta, origin) =>
      return if @ignoreChange
      this.record(delta, @oldDelta)
      @oldDelta = @quill.getContents()
    )

  clear: ->
    @stack =
      undo: []
      redo: []
    @oldDelta = @quill.getContents()

  record: (changeDelta, oldDelta) ->
    return unless changeDelta.ops.length > 0
    @stack.redo = []
    try
      undoDelta = @quill.getContents().diff(@oldDelta)
      timestamp = new Date().getTime()
      if @lastRecorded + @options.delay > timestamp and @stack.undo.length > 0
        change = @stack.undo.pop()
        undoDelta = undoDelta.compose(change.undo)
        changeDelta = change.redo.compose(changeDelta)
      else
        @lastRecorded = timestamp
      @stack.undo.push({
        redo: changeDelta
        undo: undoDelta
      })
      @stack.undo.unshift() if @stack.undo.length > @options.maxStack
    catch ignored
      console.warn('Could not record change... clearing undo stack.')
      this.clear()

  redo: ->
    this._change('redo', 'undo')

  undo: ->
    this._change('undo', 'redo')

  _getLastChangeIndex: (delta) ->
    lastIndex = 0
    index = 0
    _.each(delta.ops, (op) ->
      if op.insert?
        lastIndex = Math.max(index + (op.insert.length or 1), lastIndex)
      else if op.delete?
        lastIndex = Math.max(index, lastIndex)
      else if op.retain?
        if op.attributes?
          lastIndex = Math.max(index + op.retain, lastIndex)
        index += op.retain
    )
    return lastIndex

  _change: (source, dest) ->
    if @stack[source].length > 0
      change = @stack[source].pop()
      @lastRecorded = 0
      @ignoreChange = true
      @quill.updateContents(change[source], 'user')
      @ignoreChange = false
      index = this._getLastChangeIndex(change[source])
      @quill.setSelection(index, index)
      @oldDelta = @quill.getContents()
      @stack[dest].push(change)


Quill.registerModule('undo-manager', UndoManager)
module.exports = UndoManager
