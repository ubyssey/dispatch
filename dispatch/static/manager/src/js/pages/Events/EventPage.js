import React from 'react'

import EventEditor from '../../components/EventEditor'

export default function EventPage(props) {
  return (
    <EventEditor
      itemId={props.params.eventId}
      goBack={props.history.goBack} />
  )
}
