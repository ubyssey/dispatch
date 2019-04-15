import React from 'react'

import { Button, Intent } from '@blueprintjs/core'

import { TextInput } from '../../../components/inputs'

export default class ContentEditorLinkEditor extends React.Component {

  constructor(props) {
    super(props)

    this.handleKeyPress = this.handleKeyPress.bind(this)

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
    this.props.insertLink(this.props.selection, urlValue)
    this.setState({ urlValue: urlValue })
  }

  removeLink() {
    this.props.removeLink(this.props.selection)
    this.props.close()
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.close()
    }
  }

  render() {
    const backButton = (
      <Button
        className='c-dispatch-editor__link-popover__back'
        onClick={this.props.back}
        icon='arrow-left' />
    )

    return (
      <div className='c-dispatch-editor__link-popover'>
        {this.props.back ? backButton : null}
        <TextInput
          className='c-dispatch-editor__link-popover__input'
          ref='textInput'
          value={this.state.urlValue}
          onKeyPress={this.handleKeyPress}
          onChange={e => this.updateLink(e.target.value)}
          placeholder='Enter a URL here' />
        <Button
          className='c-dispatch-editor__link-popover__remove'
          intent={Intent.DANGER}
          onClick={() => this.removeLink()}
          icon='trash' />
      </div>
    )
  }
}
