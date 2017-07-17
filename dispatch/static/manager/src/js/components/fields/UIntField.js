import React from 'react'

import IntField from './IntField'

export default class UIntField extends React.Component {
  onChange(val) {
    if (val < 0) {
      val *= -1
    }
    this.props.onChange(val)
  }

  render() {
    return (
      <IntField
        label={this.props.label}
        data={this.props.data || ''}
        min={0}
        onChange={val => this.onChange(val)} />
    )
  }
}
