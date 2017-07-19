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
    let { selectionStart, selectionEnd } = this.refs.input.refs.input
    const initialLength = val.length

    val = val.replace(/[^\d-]+/g, '')

    // allow a '-' at start, but nowhere else
    if (val[0] == '-') {
      val = `-${val.substr(1).replace(/-/g, '')}`
    } else {
      val = val.replace(/-/g, '')
    }
    this.props.onChange(val)

    // the change in position of the caret is equal to the difference
    // in the length of the value
    const dLength = val.length - initialLength
    selectionStart += dLength
    selectionEnd += dLength

    this.setState({ selectionStart, selectionEnd })
  }

  componentDidUpdate() {
    //put the caret back in the correct place
    this.refs.input.refs.input.setSelectionRange(
      this.state.selectionStart,
      this.state.selectionEnd)
  }

  render() {
    return (
      <TextInput
        ref='input'
        placeholder={this.props.label}
        value={this.props.data || ''}
        fill={true}
        type="text"
        onChange={e => this.onChange(e.target.value)} />
    )
  }
}
