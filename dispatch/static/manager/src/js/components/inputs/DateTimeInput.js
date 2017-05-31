import React from 'react'
import { AnchorButton, Popover, Position } from '@blueprintjs/core'
import { DateTimePicker } from '@blueprintjs/datetime'

import { humanizeDatetime } from '../../util/helpers'

export default function DateTimeInput(props) {
  const textString = props.value ?
    humanizeDatetime(props.value)
    : 'Select a date and time...'

  const picker = (
    <DateTimePicker
      value={props.value}
      onChange={props.onChange}
      timePickerProps={{ // so that state updates when either
        // date or time are changed
        onChange: props.onChange
      }} />
  )

  return (
    <div>
      <Popover
        content={picker}
        popoverClassName='pt-popover-content-sizing'
        position={Position.RIGHT}>
        <AnchorButton className='c-datetimeinput-button'>
          <span className='pt-icon-standard pt-icon-calendar' />
        </AnchorButton>
      </Popover>
      <div className='c-datetimeinput-text'>
        {textString}
      </div>
    </div>
  )
}
