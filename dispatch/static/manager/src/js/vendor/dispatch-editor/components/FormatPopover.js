import React from 'react'
import { Button } from '@blueprintjs/core'

import ContentEditorLinkEditor from './LinkEditor'

const LINK_INPUT_WIDTH = 379

export default class FormatPopover extends React.Component {

  constructor(props) {
    super(props)

    this.state ={
      showLinkInput : false
    }
  }

  toggleInlineStyle(e, style) {
    e.stopPropagation()
    this.props.focusEditor()
    this.props.toggleInlineStyle(style)
  }

  toggleBlockType(e, blockType) {
    e.stopPropagation()
    this.props.focusEditor()
    this.props.toggleBlockType(blockType)
  }

  showLinkInput() {
    this.props.focusEditor()
    this.setState({ showLinkInput: true })
  }

  renderLinkInput() {
    return (
      <ContentEditorLinkEditor
        back={() => {
          this.setState({ showLinkInput: false})
          this.props.closeLinkInput()
        }}
        close={this.props.close}
        insertLink={this.props.insertLink}
        removeLink={this.props.removeLink} />
    )
  }

  renderButtons() {
    return (
      <div>
        <Button
          className='c-dispatch-editor__popover__button'
          onClick={e => this.toggleInlineStyle(e, 'BOLD')}
          title='Bold'>
          <span className='bp3-icon-standard bp3-icon-bold' />
        </Button>
        <Button
          className='c-dispatch-editor__popover__button'
          onClick={e => this.toggleInlineStyle(e, 'ITALIC')}
          title='Italic'>
          <span className='bp3-icon-standard bp3-icon-italic' />
        </Button>
        <Button
          className='c-dispatch-editor__popover__button'
          onClick={e => this.toggleInlineStyle(e, 'UNDERLINE')}
          title='Underline'>
          <span className='bp3-icon-standard bp3-icon-underline' />
        </Button>
        <Button
          className='c-dispatch-editor__popover__button'
          onClick={e => this.toggleBlockType(e, 'header-two')}
          title='Header'>
          <span className='bp3-icon-standard bp3-icon-header' />
        </Button>
        <Button
          className='c-dispatch-editor__popover__button'
          onClick={e => this.toggleBlockType(e, 'unordered-list-item')}
          title='List'>
          <span className='bp3-icon-standard bp3-icon-properties' />
        </Button>
        <Button
          className='c-dispatch-editor__popover__button'
          onClick={() => this.showLinkInput()}
          title='Link'>
          <span className='bp3-icon-standard bp3-icon-link' />
        </Button>
      </div>
    )
  }

  render() {
    const style = this.props.isLinkInputActive || this.state.showLinkInput? {width: LINK_INPUT_WIDTH} : {}
    return (
      <div
        className='c-dispatch-editor__popover'
        onMouseUp={e => e.stopPropagation()}
        style={style}>
        { this.state.showLinkInput || this.props.isLinkInputActive ? this.renderLinkInput() : this.renderButtons() }
      </div>
    )
  }
}
