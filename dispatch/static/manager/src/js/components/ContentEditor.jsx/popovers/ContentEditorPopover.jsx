import React from 'react'
import { AnchorButton } from '@blueprintjs/core'

import ContentEditorLinkEditor from './ContentEditorLinkEditor.jsx'

const LINK_INPUT_WIDTH = 379

export default class ContentEditorPopover extends React.Component {

  constructor(props) {
    super(props)
  }

  toggleStyle(e, style) {
    e.stopPropagation()
    this.props.focusEditor()
    this.props.toggleStyle(style)
  }

  showLinkInput(e) {
    console.log("showlink input should be false: "+this.props.isLinkInputActive())
    this.props.focusEditor()
    //this.setState({ showLinkInput: true })
    this.props.openLinkInput()
    console.log("should be true: "+ this.props.isLinkInputActive())
  }
//back={ e => this.setState({ showLinkInput: false})}
  renderLinkInput() {
    return (
      <ContentEditorLinkEditor
        back={this.props.closeLinkInput}
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
    //const style = this.state.showLinkInput ? {width: LINK_INPUT_WIDTH} : {}
    const style = this.props.isLinkInputActive() ? {width: LINK_INPUT_WIDTH} : {}
    console.log("Rendering the popover with " +this.props.isLinkInputActive())
    return (
      <div
        className='c-content-editor__popover'
        onMouseUp={e => e.stopPropagation()}
        style={style}>
        { this.props.isLinkInputActive() ? this.renderLinkInput() : this.renderButtons() }
    </div>
    )
  }

}
//        { this.props.isLinkInputActive ? this.renderLinkInput() : this.renderButtons() }
//        { this.state.showLinkInput ? this.renderLinkInput() : this.renderButtons() }
