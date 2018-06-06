import React from 'react'

export default class TextInput extends React.Component {

  constructor(props) {
    super(props)

    this.handleOnChange = this.handleOnChange.bind(this)

    this.input = React.createRef()

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
    this.input.current.focus()
  }

  render() {
    return (
      <input
        ref={this.input}
        className={`pt-input${ this.props.fill ? ' pt-fill' : '' }${ this.props.className ? ' ' + this.props.className : ''}`}
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
