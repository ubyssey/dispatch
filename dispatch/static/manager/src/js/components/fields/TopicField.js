import React from 'react'

import TopicSelectInput from '../inputs/selects/TopicSelectInput'

export default function TopicField(props) {
  return (
    <TopicSelectInput
      value={props.data}
      many={props.field.many}
      update={selected => props.onChange(selected)} />
  )
}
