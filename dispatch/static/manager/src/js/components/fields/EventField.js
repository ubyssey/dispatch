import React from 'react'

import { eventSchema } from '../../constants/Schemas'

import EventSelectInput from '../inputs/selects/EventSelectInput'

function EventField(props) {
  return (
    <EventSelectInput
      value={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}

EventField.type = 'event'
EventField.schema = eventSchema

export default EventField