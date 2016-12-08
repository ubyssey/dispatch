import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import { TextInput } from '../inputs'

export default class ContentEditorLinkEditor extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      urlValue: props.url || ''
    }
  }

  componentDidMount() {
    this.refs.textInput.focus()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url !== this.props.url) {
      this.setState({
        urlValue: nextProps.url || ''
      })
      this.refs.textInput.focus()
    }
  }

  updateLink(urlValue) {
    this.props.insertLink(urlValue, this.props.selection)
    this.setState({ urlValue: urlValue })
  }

  renderCloseButton() {
    return (
      <AnchorButton
        className='c-content-editor__link-popover__back'
        onClick={this.props.close}>
        <span className='pt-icon-standard pt-icon-arrow-left' />
      </AnchorButton>
    )
  }

  render() {
    return (
      <div className='c-content-editor__link-popover'>
        {this.props.close ? this.renderCloseButton() : null}
        <TextInput
          className='c-content-editor__link-popover__input'
          ref='textInput'
          value={this.state.urlValue}
          onChange={ e => this.updateLink(e.target.value)}
          placeholder='Enter a URL here' />
        <AnchorButton
          className='c-content-editor__link-popover__remove'
          intent={Intent.DANGER}>
          <span className='pt-icon-standard pt-icon-trash' />
        </AnchorButton>
      </div>
    )
  }
}
