import React from 'react'

import { pollSchema } from '../../constants/Schemas'

import PollSelectInput from '../inputs/selects/PollSelectInput'

function PollField(props) {
  return (
    <PollSelectInput
      value={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}

PollField.type = 'poll'
PollField.schema = pollSchema

export default PollField