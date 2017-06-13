import React from 'react'

import { AnchorButton, Tooltip } from '@blueprintjs/core'
import { LinkButton } from '../../../components/inputs'
import { humanizeDatetime } from '../../../util/helpers'

function LabelAndValue(props) {
  const { label, value } = props
  return (
    <div className='c-event-audit-card-label'>
      <div className='c-event-audit-card-label-label'>{label}</div>
      <div className='c-event-audit-card-label-prop'>{value}</div>
    </div>
  )
}

export default function EventCard(props) {
  return (
    <div className='pt-card pt-elevation-2 c-event-audit-card'>
      <div className='c-event-audit-card-title'>
        {props.event.title}
      </div>

      <div className='c-event-audit-card-nottitle'>
        <LabelAndValue label='Description' value={props.event.description} />
        <LabelAndValue label='Host' value={props.event.host} />
        <LabelAndValue label='Start' value={humanizeDatetime(props.event.start_time)} />
        <LabelAndValue label='End' value={humanizeDatetime(props.event.end_time)} />
        <LabelAndValue label='Location' value={props.event.location} />
        <LabelAndValue label='Address' value={props.event.address} />
        <LabelAndValue label='Category' value={props.event.category} />
        <LabelAndValue label='FB Link' value={props.event.facebook_url} />
      </div>

      <div className='c-event-audit-card-image-cont'>
        <img
          className='c-event-audit-card-image'
          src={props.event.image} />
      </div>

      <div className='c-event-audit-card-button-border' />
      <div className='c-event-audit-card-button-row'>

        <Tooltip
          className='c-event-audit-card-button-right'
          transitionDuration={15}
          content="Delete">
          <AnchorButton onClick={() => props.disapprove()}>
            Disapprove
          </AnchorButton>
        </Tooltip>

        <AnchorButton
          onClick={() => props.approve()}>
          Approve
        </AnchorButton>

        <LinkButton
          className='c-event-audit-card-button-edit'
          to={`/events/${props.event.id}`}>
          Edit
        </LinkButton>

      </div>
    </div>
  )
}
