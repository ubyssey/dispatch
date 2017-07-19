import React from 'react'

import EventSelectInput from '../inputs/EventSelectInput'

export default function EventField(props) {
  return (
    <EventSelectInput
      selected={props.data}
      many={props.many}
      onChange={selected => props.onChange(selected)} />
  )
}
