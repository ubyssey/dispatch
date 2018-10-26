import React from 'react'

import { topicSchema } from '../../constants/Schemas'

import TopicSelectInput from '../inputs/selects/TopicSelectInput'

function TopicField(props) {
  return (
    <TopicSelectInput
      value={props.data}
      many={props.field.many}
      update={selected => props.onChange(selected)} />
  )
}

TopicField.type = 'topic'
TopicField.schema = topicSchema

export default TopicField