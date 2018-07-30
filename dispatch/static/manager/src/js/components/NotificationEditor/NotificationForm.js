import React from 'react'
import { Position } from '@blueprintjs/core'

import { FormInput, DateTimeInput } from '../inputs'
require('../../../styles/components/notifications.scss')
export default function NotificationForm(props) {

  return (
    <form onSubmit={e => e.preventDefault()}>
      <FormInput
        label='Article'
        padded={false}>
        : {props.listItem.article_headline}
      </FormInput>
      <div className='o-notification-date-select'>
        <FormInput
          label='Scheduled push time'
          padded={false}
          error={props.errors.scheduled_push_time}>
          <DateTimeInput
            value={props.listItem.scheduled_push_time}
            position={Position.BOTTOM}
            onChange={dt => props.update('scheduled_push_time', dt)} />
        </FormInput>
      </div>
    </form>
  )
}
