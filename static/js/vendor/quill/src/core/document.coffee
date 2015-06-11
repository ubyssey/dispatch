_          = require('lodash')
Delta      = require('rich-text/lib/delta')
dom        = require('../lib/dom')
Format     = require('./format')
Line       = require('./line')
Embed      = require('./embed')
LinkedList = require('../lib/linked-list')
Normalizer = require('../lib/normalizer')


class Document
  constructor: (@root, @editor, options = {}) ->
    @formats = {}
    _.each(options.formats, _.bind(this.addFormat, this))
    this.setHTML(@root.innerHTML)

  addFormat: (name, config) ->
    config = Format.FORMATS[name] unless _.isObject(config)
    console.warn('Overwriting format', name, @formats[name]) if @formats[name]?
    @formats[name] = new Format(config)

  appendLine: (lineNode) ->
    return this.insertLineBefore(lineNode, null)

  appendEmbed: (embedNode, type, data) ->
    return this.insertEmbedBefore(embedNode, null, type, data)

  findLeafAt: (index, inclusive) ->
    [line, offset] = this.findLineAt(index)
    return if line? then line.findLeafAt(offset, inclusive) else [null, offset]

  findLine: (node) ->
    while node? and !dom.BLOCK_TAGS[node.tagName]?
      node = node.parentNode
    line = if node? then @lineMap[node.id] else null
    return if line?.node == node then line else null

  findLineAt: (index) ->
    return [null, index] unless @lines.length > 0
    length = this.toDelta().length()     # TODO optimize
    return [@lines.last, @lines.last.length] if index == length
    return [null, index - length] if index > length
    curLine = @lines.first
    while curLine?
      return [curLine, index] if index < curLine.length
      index -= curLine.length
      curLine = curLine.next
    return [null, index]    # Should never occur unless length calculation is off

  getHTML: ->
    html = @root.innerHTML
    # Preserve spaces between tags
    html = html.replace(/\>\s+\</g, '>&nbsp;<')
    container = document.createElement('div')
    container.innerHTML = html
    _.each(container.querySelectorAll(".#{Line.CLASS_NAME}"), (node) ->
      dom(node).removeClass(Line.CLASS_NAME)
      node.removeAttribute('id')
    )
    return container.innerHTML

  getJSON: ->
    line = @lines.first
    objects = []
    while(line)
      objects.push(line.getJSON())
      line = line.next
    return objects

  insertLineBefore: (newLineNode, refLine) ->
    line = new Line(this, newLineNode)
    if refLine?
      @root.insertBefore(newLineNode, refLine.node) unless dom(newLineNode.parentNode).isElement()  # Would prefer newLineNode.parentNode? but IE will have non-null object
      @lines.insertAfter(refLine.prev, line)
    else
      @root.appendChild(newLineNode) unless dom(newLineNode.parentNode).isElement()
      @lines.append(line)
    @lineMap[line.id] = line
    return line

  insertEmbedBefore: (newEmbedNode, refLine, type, data) ->
    embed = new Embed(this, newEmbedNode, type, data)
    if refLine?
      @root.insertBefore(newEmbedNode, refLine.node) unless dom(newEmbedNode.parentNode).isElement()  # Would prefer newLineNode.parentNode? but IE will have non-null object
      @lines.insertAfter(refLine.prev, embed)
    else
      @root.appendChild(newEmbedNode) unless dom(newEmbedNode.parentNode).isElement()
      @lines.append(embed)
    @lineMap[embed.id] = embed
    return embed

  mergeLines: (line, lineToMerge) ->
    if lineToMerge.length > 1
      dom(line.leaves.last.node).remove() if line.length == 1
      _.each(dom(lineToMerge.node).childNodes(), (child) ->
        line.node.appendChild(child) if child.tagName != dom.DEFAULT_BREAK_TAG
      )
    this.removeLine(lineToMerge)
    line.rebuild()

  optimizeLines: ->
    # TODO optimize algorithm (track which lines get dirty and only Normalize.optimizeLine those)
    _.each(@lines.toArray(), (line, i) ->
      line.optimize()
      return true    # line.optimize() might return false, prevent early break
    )

  rebuild: ->
    lines = @lines.toArray()
    lineNode = @root.firstChild
    lineNode = lineNode.firstChild if lineNode? and dom.LIST_TAGS[lineNode.tagName]?
    _.each(lines, (line, index) =>
      while line.node != lineNode
        if line.node.parentNode == @root or line.node.parentNode?.parentNode == @root
          # New line inserted
          lineNode = Normalizer.normalizeLine(lineNode)
          newLine = this.insertLineBefore(lineNode, line)
          lineNode = dom(lineNode).nextLineNode(@root)
        else
          # Existing line removed
          return this.removeLine(line)
      if line.outerHTML != lineNode.outerHTML
        # Existing line changed
        line.node = Normalizer.normalizeLine(line.node)
        line.rebuild()
      lineNode = dom(lineNode).nextLineNode(@root)
    )
    # New lines appended
    while lineNode?
      if dom(lineNode).hasClass(Embed.CLASS_NAME)
        this.appendEmbed(lineNode)
      else
        lineNode = Normalizer.normalizeLine(lineNode)
        this.appendLine(lineNode)
      lineNode = dom(lineNode).nextLineNode(@root)

  removeLine: (line) ->
    if line.node.parentNode?
      if dom.LIST_TAGS[line.node.parentNode.tagName] and line.node.parentNode.childNodes.length == 1
        dom(line.node.parentNode).remove()
      else
        dom(line.node).remove()
    delete @lineMap[line.id]
    @lines.remove(line)


  buildFromJSON: (data) ->
    @lines = new LinkedList()
    @lineMap = {}
    @root.innerHTML = ''
    _.each(data, (line) =>
      if line.type == 'paragraph'
        newLine = this.appendLine(document.createElement(dom.DEFAULT_BLOCK_TAG))
        newLine.node.innerHTML = line.data;
      else
        newEmbed = this.appendEmbed(document.createElement(dom.DEFAULT_EMBED_TAG), line.type, line.data)
    )
    this.rebuild()

  setHTML: (html) ->
    html = Normalizer.stripComments(html)
    html = Normalizer.stripWhitespace(html)
    @root.innerHTML = html
    @lines = new LinkedList()
    @lineMap = {}
    this.rebuild()

  splitLine: (line, offset) ->
    offset = Math.min(offset, line.length - 1)
    [lineNode1, lineNode2] = dom(line.node).split(offset, true)
    line.node = lineNode1
    line.rebuild()
    newLine = this.insertLineBefore(lineNode2, line.next)
    newLine.formats = _.clone(line.formats)
    newLine.resetContent()
    return newLine

  toDelta: ->
    lines = @lines.toArray()
    delta = new Delta()
    _.each(lines, (line) ->
      _.each(line.delta.ops, (op) ->
        delta.push(op)
      )
    )
    return delta


module.exports = Document
