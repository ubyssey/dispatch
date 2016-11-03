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

  render() {
    return (
      <input
        className='c-input c-input--text'
        type='text'
        value={this.props.value}
        placeholder={this.props.placeholder}
        onChange={this.handleOnChange}
        onKeyPress={this.props.onKeyPress} />
    )
  }
}
