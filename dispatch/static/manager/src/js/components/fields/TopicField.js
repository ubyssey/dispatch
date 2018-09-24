import React from 'react'

import TopicSelectInput from '../inputs/selects/TopicSelectInput'

export default function TopicField(props) {
  return (
    <TopicSelectInput
      selected={props.data}
      many={props.field.many}
      update={selected => props.onChange(selected)} />
  )
}
