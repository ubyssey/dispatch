import React from 'react'

import { TextAreaInput } from '../inputs'

export default function TextField(props) {

  return (
    <TextAreaInput
      placeholder={props.label}
      value={props.data || ''}
      rows='5'
      onChange={e => props.onChange(e.target.value)} />
  )

}
