import React from 'react'
import { AnchorButton } from '@blueprintjs/core'

import ContentEditorLinkEditor from './ContentEditorLinkEditor'

const LINK_INPUT_WIDTH = 379

export default class ContentEditorPopover extends React.Component {

  constructor(props) {
    super(props)


    this.state ={
      showLinkInput : false
    }
  }

  toggleStyle(e, style) {
    e.stopPropagation()
    this.props.focusEditor()
    this.props.toggleStyle(style)
  }

  showLinkInput(e) {
    this.props.focusEditor()
    this.setState({ showLinkInput: true })
  }
//back={ e => this.setState({ showLinkInput: false})}
  renderLinkInput() {
    return (
      <ContentEditorLinkEditor
        back={e => {
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
        <AnchorButton
          className='c-content-editor__popover__button'
          onClick={ e => this.toggleStyle(e, 'BOLD') }
          title='Bold'>
          <span className='pt-icon-standard pt-icon-bold'></span>
        </AnchorButton>
        <AnchorButton
          className='c-content-editor__popover__button'
          onClick={ e => this.toggleStyle(e, 'ITALIC') }
          title='Italic'>
          <span className='pt-icon-standard pt-icon-italic'></span>
        </AnchorButton>
        <AnchorButton
          className='c-content-editor__popover__button'
          onClick={ e => this.toggleStyle(e, 'UNDERLINE') }
          title='Underline'>
          <span className='pt-icon-standard pt-icon-underline'></span>
        </AnchorButton>
        <AnchorButton
          className='c-content-editor__popover__button'
          title='Header'>
          <span className='pt-icon-standard pt-icon-header'></span>
        </AnchorButton>
        <AnchorButton
          className='c-content-editor__popover__button'
          title='List'>
          <span className='pt-icon-standard pt-icon-properties'></span>
        </AnchorButton>
        <AnchorButton
          className='c-content-editor__popover__button'
          onClick={e => this.showLinkInput()}
          title='Link'>
          <span className='pt-icon-standard pt-icon-link'></span>
        </AnchorButton>
      </div>
    )
  }

  render() {
    const style = this.props.isLinkInputActive() || this.state.showLinkInput? {width: LINK_INPUT_WIDTH} : {}
    return (
      <div
        className='c-content-editor__popover'
        onMouseUp={e => e.stopPropagation()}
        style={style}>
        { this.state.showLinkInput || this.props.isLinkInputActive() ? this.renderLinkInput() : this.renderButtons() }
    </div>
    )
  }
}
