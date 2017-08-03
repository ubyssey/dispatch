import React from 'react'

import EventSelectInput from '../inputs/EventSelectInput'

export default function EventField(props) {
  const selected = props.data.map((event) => {
    if (typeof event === 'object') {
      return event.id
    }
    return event
  })

  return (
    <EventSelectInput
      selected={selected}
      many={props.many}
      onChange={selected => props.onChange(selected)} />
  )
}
