import React from 'react'

import { TextInput } from '../inputs'

export default class IntegerField extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectionStart: 0,
      selectionEnd: 0
    }
  }

  onChange(val) {
    let { selectionStart, selectionEnd } = this.refs.textInput.refs.input
    const initialLength = val.length

    val = val.replace(/[^\d-]+/g, '')

    // allow a '-' at start, but nowhere else
    if (val[0] == '-') {
      val = `-${val.substr(1).replace(/-/g, '')}`
    } else {
      val = val.replace(/-/g, '')
    }

    // the change in position of the caret is equal to the difference
    // in the length of the value
    const dLength = val.length - initialLength
    selectionStart += dLength
    selectionEnd += dLength

    this.setState({ selectionStart, selectionEnd }, () => this.props.onChange(val))
  }

  componentDidUpdate() {
    //put the caret back in the correct place
    this.refs.textInput.refs.input.setSelectionRange(
      this.state.selectionStart,
      this.state.selectionEnd)
  }

  render() {
    return (
      <TextInput
        ref='textInput'
        placeholder={this.props.field.label}
        value={this.props.data || ''}
        fill={true}
        type="text"
        onChange={e => this.onChange(e.target.value)} />
    )
  }
}
