import React from 'react'

import { SelectInput } from '../inputs'

export default function SelectField(props) {
  return (
    <SelectInput
      placeholder={props.field.label}
      selected={props.data || ''}
      options={props.field.options}
      onChange={e => props.onChange(e.target.value)} />
  )
}
