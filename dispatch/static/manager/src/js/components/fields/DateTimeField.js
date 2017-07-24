import React from 'react'

import DateTimeInput from '../inputs/DateTimeInput'

export default function DateTimeField(props) {
  return (
    <DateTimeInput
      value={props.data}
      onChange={selected => props.onChange(selected)} />
  )
}
