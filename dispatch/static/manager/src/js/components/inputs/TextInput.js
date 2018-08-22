import React from 'react'

export default class TextInput extends React.Component {

  constructor(props) {
    super(props)

    this.handleOnChange = this.handleOnChange.bind(this)

    this.saveTimeout = null
    this.saveNextUpdate = false
  }

  componentDidUpdate() {
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
        className={`bp3-input${ this.props.fill ? ' bp3-fill' : '' }${ this.props.className ? ' ' + this.props.className : ''}`}
        type={this.props.type || 'text'}
        value={this.props.value || ''}
        step={this.props.step || ''}
        min={this.props.min}
        max={this.props.max}
        disabled={this.props.disabled}
        placeholder={this.props.placeholder}
        onChange={this.handleOnChange}
        readOnly={this.props.readOnly}
        onKeyPress={this.props.onKeyPress} />
    )
  }
}
