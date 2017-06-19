import React from 'react'

import EventEditor from '../../components/EventEditor'

export default function NewEventPage(props) {
  return (
    <EventEditor
      isNew={true}
      goBack={props.history.goBack} />
  )
}
