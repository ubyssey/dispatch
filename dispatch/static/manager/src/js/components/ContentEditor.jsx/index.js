import React from 'react'
import R from 'ramda'

import {Editor, EditorState, RichUtils, AtomicBlockUtils, Entity, Modifier, convertToRaw} from 'draft-js';

import ContentEditorEmbed from './ContentEditorEmbed.jsx'

import ImageEmbed from './embeds/ImageEmbed.jsx'

import applyInlineStyles from './applyInlineStyles'

const EMBEDS = {
  IMAGE: ImageEmbed
}

export default class ContentEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.insertImage = this.insertImage.bind(this)
    this.blockRenderer = this.blockRenderer.bind(this)
    this.startEditingEntity = this.startEditingEntity.bind(this)
    this.stopEditingEntity = this.stopEditingEntity.bind(this)

    this.state = {
      readOnly: false
    }
  }

  getJSON() {

    function parseBlock(block) {
      const type = block.getType()

      if (type === 'atomic') {
        const entity = Entity.get(block.getEntityAt(0))
        return {
          type: entity.getType(),
          data: entity.getData()
        }
      } else {

        return {
          type: 'PARAGRAPH',
          data: applyInlineStyles(block)
        }
      }

    }

    return R.map(parseBlock, this.props.content.getCurrentContent().getBlockMap()).toList().toJSON()
  }

  onChange(editorState) {
    this.props.update('content', editorState)
    console.log(this.getJSON())
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.props.content, command)
    if (newState) {
      this.onChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  insertEmbed(type, data={}) {
    const editorState = this.props.content

    const contentState = editorState.getCurrentContent()

    const key = Entity.create(type, 'IMMUTABLE', data)

    const contentStateWithEntity = Modifier.applyEntity(
      contentState,
      contentState.getSelectionAfter(),
      key
    )

    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    )

    const newState = AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      key,
      ' '
    )

    this.onChange(newState)
  }

  insertImage(e) {
    e.preventDefault()

    this.insertEmbed('IMAGE')
  }

  startEditingEntity() {
    this.setState({ readOnly: true })
  }

  stopEditingEntity() {
    this.setState({ readOnly: false })
  }

  blockRenderer(contentBlock) {
    const type = contentBlock.getType()

    if (type === 'atomic') {
      const embedType = Entity.get(contentBlock.getEntityAt(0)).getType()

      return {
        component: ContentEditorEmbed,
        editable: false,
        props: {
          embedComponent: EMBEDS[embedType],
          onFocus: this.startEditingEntity,
          onBlur: this.stopEditingEntity
        }
      }
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.insertImage}>Insert image</button>
        <Editor
          readOnly={this.state.readOnly}
          editorState={this.props.content}
          handleKeyCommand={this.handleKeyCommand}
          blockRendererFn={this.blockRenderer}
          onChange={this.onChange} />
      </div>
    )
  }
}
