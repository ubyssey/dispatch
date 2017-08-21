import React from 'react'

import { TextInput } from '../inputs'

export default function CharField(props) {
  return (
    <TextInput
      placeholder={props.field.label}
      value={props.data || ''}
      fill={true}
      onChange={e => props.onChange(e.target.value)} />
  )
}
