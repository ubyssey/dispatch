import React from 'react'

export default class TextInput extends React.Component {

  constructor(props) {
    super(props)

    this.handleOnChange = this.handleOnChange.bind(this)

    this.saveTimeout = null
    this.saveNextUpdate = false
  }

  componentDidUpdate(prevProps) {
    if (this.saveNextUpdate) {
      clearTimeout(this.saveTimeout)

      this.saveTimeout = setTimeout(
        this.props.onDelayedSave,
        this.props.saveDelay
      )

      this.saveNextUpdate = false
    }
  }

  handleOnChange(e) {
    this.props.onChange(e)
    this.saveNextUpdate = true
  }

  focus() {
    this.refs.input.focus()
  }

  render() {
    return (
      <input
        ref='input'
        className={`pt-input${ this.props.fill ? ' pt-fill' : '' }${ this.props.className ? ' ' + this.props.className : ''}`}
        type={this.props.type || 'text'}
        value={this.props.value}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
        onChange={this.handleOnChange}
        onKeyPress={this.props.onKeyPress} />
    )
  }
}
