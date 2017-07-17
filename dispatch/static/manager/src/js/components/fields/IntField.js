import React from 'react'

import { TextInput } from '../inputs'

export default class IntField extends React.Component {
  onChange(val) {
    val = val.replace(/[^\d]/, '')
    this.props.onChange(Math.floor(val))
  }

  render() {
    return (
      <TextInput
        placeholder={this.props.label}
        value={this.props.data || ''}
        fill={true}
        type="text"
        step={1}
        min={this.props.min}
        onChange={e => this.onChange(e.target.value)} />
    )
  }
}
