import React from 'react'
import qwery from 'qwery'

import {
  Editor,
  EditorState,
  SelectionState,
  RichUtils,
  AtomicBlockUtils,
  Entity,
  Modifier,
  convertToRaw
} from 'draft-js';

import applyInlineStyles from './applyInlineStyles'
import ContentEditorEmbedToolbar from './ContentEditorEmbedToolbar.jsx'
import ContentEditorEmbed from './ContentEditorEmbed.jsx'

// Helper functions
function buildEmbedMap(embeds) {
  let embedMap = {}

  for(var i = 0; i < embeds.length; i++) {
    embedMap[embeds[i].type] = embeds[i].component
  }

  return embedMap
}

function blockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  const baseStyle = 'c-content-editor__editor__block c-content-editor__editor__block'

  switch(type) {
    case 'unstyled':
      return baseStyle + '--unstyled';
    case 'atomic':
      return baseStyle + '--embed';
  }
}

export default class ContentEditor extends React.Component {

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.blockRenderer = this.blockRenderer.bind(this)
    this.startEditingEntity = this.startEditingEntity.bind(this)
    this.stopEditingEntity = this.stopEditingEntity.bind(this)
    this.insertEmbed = this.insertEmbed.bind(this)

    this.embedMap = buildEmbedMap(this.props.embeds)

    this.state = {
      editorState: EditorState.createEmpty(),
      readOnly: false,
      showEmbedToolbar: false,
      embedToolbarOffset: 0,
      activeBlock: null
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

    return this.state.editorState.getCurrentContent().getBlockMap()
      .map(parseBlock)
      .toList()
      .toJS()
  }

  onChange(editorState) {
    this.setState({
      editorState: editorState
    })
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newState) {
      this.onChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  insertEmbed(type, data={}) {

    // Get active block key
    const blockKey = this.state.activeBlock

    // Create new entity with given type and data
    const entityKey = Entity.create(type, 'IMMUTABLE', data)

    // Fetch editorState and contentState
    let editorState = this.state.editorState
    let contentState = editorState.getCurrentContent()

    // Add entity to contentState
    const contentStateWithEntity = Modifier.applyEntity(
      contentState,
      contentState.getSelectionAfter(),
      entityKey
    )

    // Update editorState with new contentState
    editorState = EditorState.set(
      editorState,
      {'currentContent': contentStateWithEntity}
    )

    // Insert atomic block
    editorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')

    // Fetch the new contentState
    contentState = editorState.getCurrentContent()

    // Remove the empty block from the blockMap
    let blockMap = contentState.getBlockMap()
    contentState = contentState.set('blockMap', blockMap.delete(blockKey))

    // Update editorState with new contentState
    editorState = EditorState.set(
      editorState,
      {currentContent: contentState}
    )

    this.onChange(editorState)

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
          embedComponent: this.embedMap[embedType],
          onFocus: this.startEditingEntity,
          onBlur: this.stopEditingEntity
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let contentState = this.state.editorState.getCurrentContent()
    let key = this.state.editorState.getSelection().getStartKey()

    if (!contentState.getBlockForKey(key).getText()) {
      let blockNode = qwery(`div[data-offset-key="${key}-0-0"]`)[0]

      if (!blockNode) {
        return
      }

      let offset = blockNode.offsetTop

      if (this.state.embedToolbarOffset !== offset || !this.state.showEmbedToolbar) {
        this.setState({
          embedToolbarOffset: offset,
          showEmbedToolbar: true,
          activeBlock: key
        })
      }

    } else {
      if (this.state.showEmbedToolbar) {
        this.setState({
          showEmbedToolbar: false
        })
      }
    }
  }

  render() {
    return (
      <div className='c-content-editor'>
        <div className='c-content-editor__editor'>
          <Editor
            readOnly={this.state.readOnly}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            blockRendererFn={this.blockRenderer}
            blockStyleFn={blockStyleFn}
            onChange={this.onChange} />
        </div>
        <ContentEditorEmbedToolbar
          embeds={this.props.embeds}
          showToolbar={this.state.showEmbedToolbar}
          offset={this.state.embedToolbarOffset}
          insertEmbed={this.insertEmbed}
          openModal={this.props.openModal}
          closeModal={this.props.closeModal} />
      </div>
    )
  }
}
