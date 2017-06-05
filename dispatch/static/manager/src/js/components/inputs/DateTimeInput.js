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
      value={props.value || new Date()}
      onChange={props.onChange}
      timePickerProps={{
        onChange: props.onChange
      }} />
  )

  return (
    <div className='c-input--datetime'>
      <Popover
        content={picker}
        popoverClassName='pt-popover-content-sizing'
        position={Position.RIGHT}>
        <AnchorButton className='c-input--datetime-button'>
          <span className='pt-icon-standard pt-icon-calendar' />
        </AnchorButton>
      </Popover>
      <div className='c-input--datetime-text'>
        {textString}
      </div>
    </div>
  )
}
