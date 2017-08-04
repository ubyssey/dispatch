import React from 'react'
import qwery from 'qwery'

import { Popover, Position } from '@blueprintjs/core'

import {
  Editor,
  EditorState,
  SelectionState,
  Entity,
  getDefaultKeyBinding,
  KeyBindingUtil,
  CompositeDecorator
} from 'draft-js'

const {hasCommandModifier} = KeyBindingUtil

import * as actions from '../actions'

import EmbedToolbar from './EmbedToolbar'
import Embed from './Embed'
import FormatPopover from './FormatPopover'
import LinkPopover from './LinkPopover'

import LinkEntity from '../entities/LinkEntity'

require('../styles/editor.scss')

// Helper functions
function buildEmbedMap(embeds) {
  let embedMap = {}

  for(var i = 0; i < embeds.length; i++) {
    embedMap[embeds[i].type] = embeds[i]
  }

  return embedMap
}

function blockStyleFn(contentBlock) {
  const type = contentBlock.getType()
  const baseStyle = 'c-dispatch-editor__editor__block c-dispatch-editor__editor__block'

  switch(type) {
  case 'unstyled':
    return baseStyle + '--unstyled'
  case 'atomic':
    return baseStyle + '--embed'
  }
}

function keyBindingFn(e) {

  // CMD + K
  if (e.keyCode === 75 && hasCommandModifier(e)) {
    return 'insert-link'
  }

  return getDefaultKeyBinding(e)
}

const decorator = new CompositeDecorator([
  LinkEntity
])

class ContentEditor extends React.Component {

  initialState() {
    return {
      editorState: EditorState.createEmpty(decorator),
      readOnly: false,
      showEmbedToolbar: false,
      showPopover: false,
      embedToolbarOffset: 0,
      popover: {
        renderContent: this.renderPopover.bind(this)
      },
      activeBlock: null,
      isLinkInputActive: false
    }
  }

  constructor(props) {
    super(props)
    this.embedMap = buildEmbedMap(this.props.embeds)

    this.state = this.initialState()

  }

  componentWillReceiveProps(nextProps) {
    // Push content to editor state
    if (nextProps.content) {
      this.setState({
        editorState: EditorState.push(this.state.editorState, nextProps.content)
      })
    } else {
      this.setState(this.initialState())
    }
  }

  componentWillMount() {
    // Push content to editor state
    if (this.props.content) {
      this.onChange(EditorState.push(this.state.editorState, this.props.content))
    }
  }

  onChange(editorState) {
    this.setState(
      { editorState: editorState },
      function() {
        if (this.state.editorState.getLastChangeType()) {
          // Only emit update if content changes
          this.props.onUpdate(this.state.editorState.getCurrentContent())
        }
      }
    )
  }

  insertEmbed(type, data={}) {
    this.onChange(actions.insertEmbed(this.state.editorState, this.state.activeBlock, type, data))
  }

  removeEmbed(blockKey) {
    this.onChange(actions.removeEmbed(this.state.editorState, blockKey))
    this.focusEditor()
  }

  insertLink(selection, url) {
    this.onChange(actions.insertLink(this.state.editorState, selection, url))
  }

  removeLink(selection) {
    this.onChange(actions.removeLink(this.state.editorState, selection))
  }

  startEditingEntity() {
    this.setState({ readOnly: true })
  }

  stopEditingEntity() {
    this.setState({ readOnly: false })
  }

  handleMouseUp() {
    const contentState = this.state.editorState.getCurrentContent()

    function getSelected() {
      var t = ''
      if (window.getSelection) {
        t = window.getSelection()
      } else if (document.getSelection) {
        t = document.getSelection()
      } else if (document.selection) {
        t = document.selection.createRange().text
      }
      return t
    }

    function getLinkEntity(selection) {
      const contentBlock = contentState.getBlockForKey(selection.getStartKey())
      const entityKey = contentBlock.getEntityAt(selection.getStartOffset())

      const isLinkEntity =
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'

      // If there is no entity at this offset or the entity is not a link, return null
      if (!isLinkEntity) {
        return
      }

      let entityRange = null

      contentBlock.findEntityRanges(
        (character) => {
          // Find range for the current link entity
          return character.getEntity() === entityKey
        },
        (start, end) => {
          // Set entityRange to be the range of the current link entity
          entityRange = [start, end]
        }
      )

      if (entityRange) {

        // Create new SelectionState instance
        let selectionState = SelectionState.createEmpty(contentBlock.getKey())

        // Update the selection state to match the current entity range
        selectionState = selectionState.merge({
          anchorOffset: entityRange[0],
          focusOffset: entityRange[1]
        })

        // Return the entity and selection state
        return {
          entity: Entity.get(entityKey),
          selection: selectionState
        }
      }
    }

    setTimeout(()=> {
      const selection = this.state.editorState.getSelection(),
        isCollapsed = selection.isCollapsed(),
        linkEntity = getLinkEntity(selection),
        showLinkPopover = isCollapsed && linkEntity

      if ( !isCollapsed || showLinkPopover ) {

        var selected = getSelected().getRangeAt(0).getBoundingClientRect()
        var container = this.refs.container.getBoundingClientRect()

        var position,
          left = selected.left - container.left,
          center = left + (selected.width / 2),
          third = container.width / 3

        if (center > 2 * third) {
          position = Position.TOP_RIGHT
          left = left - 600 + (selected.width / 2) + 15
        } else if (center > third ) {
          position = Position.TOP
          left = left - 300 + (selected.width / 2)
        } else {
          if (selected.width == 0) {
            left = left - 15
          }
          position = Position.TOP_LEFT
        }

        this.setState({
          showPopover: true,
          popover: {
            top: selected.top - container.top,
            left: left,
            position: position,
            renderContent: showLinkPopover ? this.renderLinkPopover.bind(this) : this.renderPopover.bind(this),
            linkEntity: linkEntity
          }
        }, this.refs.editor.focus)

      } else {
        this.setState(
          {
            showPopover: false,
            isLinkInputActive: false
          },
          this.refs.editor.focus
        )
      }

    }, 1)
  }

  handleKeyCommand(command) {
    if (command === 'insert-link') {
      this.setState({isLinkInputActive: true})
      return 'handled'
    }

    this.onChange(actions.handleKeyCommand(this.state.editorState, command))
  }

  blockRenderer(contentBlock) {
    const type = contentBlock.getType()

    if (type === 'atomic') {
      const embedType = Entity.get(contentBlock.getEntityAt(0)).getType()
      const embed = this.embedMap[embedType]

      return {
        component: Embed,
        editable: false,
        props: {
          type: embedType,
          embedComponent: embed.component,
          onFocus: () => this.startEditingEntity(),
          onBlur: () => this.stopEditingEntity(),
          removeEmbed: bk => this.removeEmbed(bk),
          openModal: this.props.openModal,
          closeModal: this.props.closeModal,
          modal: embed.modal,
          modalCallback: embed.modalCallback,
          showEdit: embed.showEdit
        }
      }
    }
  }

  componentDidUpdate() {
    let contentState = this.state.editorState.getCurrentContent()
    let key = this.state.editorState.getSelection().getStartKey()
    let block = contentState.getBlockForKey(key)

    if (!block) {
      return
    }

    if (!block.getText()) {
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

  toggleInlineStyle(style) {
    this.onChange(actions.toggleInlineStyle(this.state.editorState, style))
    this.closePopover()
  }

  focusEditor() {
    this.refs.editor.focus()
  }

  closePopover() {
    this.setState({ showPopover: false })
  }

  renderPopover() {
    return (
      <FormatPopover
        insertLink={(selection, url) => this.insertLink(selection, url)}
        removeLink={(selection) => this.removeLink(selection)}
        toggleStyle={s => this.toggleInlineStyle(s)}
        isLinkInputActive={this.state.isLinkInputActive}
        closeLinkInput={() => this.setState({isLinkInputActive : false})}
        focusEditor={() => null }
        close={() => this.closePopover} />
    )
  }

  renderLinkPopover(linkEntity) {
    return (
      <LinkPopover
        insertLink={(selection, url) => this.insertLink(selection, url)}
        removeLink={(selection) => this.removeLink(selection)}
        url={linkEntity.entity.get('data').url}
        selection={linkEntity.selection}
        close={this.closePopover} />
    )
  }

  render() {
    const popoverContainerStyle = {
      position: 'absolute',
      top: this.state.popover.top,
      width: 600,
      left: this.state.popover.left
    }

    return (
      <div
        ref='container'
        className='c-dispatch-editor'
        onMouseUp={e => this.handleMouseUp(e)}>
        <div className='c-dispatch-editor__editor'>
          <Editor
            ref='editor'
            readOnly={this.state.readOnly}
            editorState={this.state.editorState}
            handleKeyCommand={c => this.handleKeyCommand(c)}
            keyBindingFn={keyBindingFn}
            blockRendererFn={cb => this.blockRenderer(cb)}
            blockStyleFn={blockStyleFn}
            onChange={es => this.onChange(es)} />
        </div>
        <div style={popoverContainerStyle}>
          <Popover
            isOpen={this.state.showPopover}
            inline={true}
            content={this.state.popover.renderContent(this.state.popover.linkEntity)}
            position={this.state.popover.position}
            useSmartArrowPositioning={false}
            enforceFocus={false}>
            <div></div>
          </Popover>
        </div>
        <EmbedToolbar
          embeds={this.props.embeds}
          showToolbar={this.state.showEmbedToolbar}
          offset={this.state.embedToolbarOffset}
          insertEmbed={(t, d) => this.insertEmbed(t, d)} />
      </div>
    )
  }
}

export default ContentEditor
