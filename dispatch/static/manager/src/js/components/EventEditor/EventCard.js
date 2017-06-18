import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'
import { TextInput, TextAreaInput, LinkButton } from '../inputs'
import { humanizeDatetime } from '../../util/helpers'

import Panel from '../Panel'

function EventField(props) {
  const { label, value } = props
  return (
    <label className='c-event-card__field'>
      {label}
      <TextInput
        readOnly={true}
        fill={true}
        value={value} />
    </label>
  )
}

export default function EventCard(props) {

  const image = (
    <div
      className='c-event-card__image'
      style={{backgroundImage: `url('${props.event.image}')`}}>
    </div>
  )

  return (
    <div className='c-event-card'>
      <Panel
        title={props.event.title}>

        {props.event.image ? image : null}

        <div className='c-event-card__fields'>

          <label className='c-event-card__field'>
            Description
            <TextAreaInput
              readOnly={true}
              fill={true}
              rows={2}
              value={props.event.description} />
          </label>

          <EventField label='Host' value={props.event.host} />

          <div className='c-event-card__fields__row'>
            <EventField label='Start' value={humanizeDatetime(props.event.start_time)} />
            <EventField label='End' value={humanizeDatetime(props.event.end_time)} />
          </div>

          <EventField label='Location' value={props.event.location} />
          <EventField label='Address' value={props.event.address} />
          <EventField label='Category' value={props.event.category} />
        </div>

        <div className='c-event-card__buttons'>

          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={() => props.approve()}>
            Approve
          </AnchorButton>

          <AnchorButton
            intent={Intent.DANGER}
            onClick={() => props.disapprove()}>
            Disapprove
          </AnchorButton>

          <LinkButton
            to={`/events/${props.event.id}`}>
            Edit
          </LinkButton>

        </div>
      </Panel>
    </div>
  )
}
