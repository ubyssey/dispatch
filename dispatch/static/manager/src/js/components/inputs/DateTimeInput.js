import React from 'react'
import { Popover, Position } from '@blueprintjs/core'
import { DateTimePicker } from '@blueprintjs/datetime'

import { humanizeDatetime } from '../../util/helpers'

const TODAY = new Date()
const MAX_DATE = new Date(TODAY.getFullYear()+1,12,31)

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
      }}
      datePickerProps={{
        minDate: TODAY,
        maxDate: MAX_DATE
      }} />
  )

  return (
    <div className='c-input--datetime'>
      <Popover
        content={picker}
        popoverClassName='pt-popover-content-sizing'
        position={props.position || Position.TOP}>
        <div className='pt-control-group'>
          <button className='pt-button pt-icon-calendar c-input--datetime-button' />
          <input
            type='text'
            className='pt-input c-input--datetime--textfield'
            value={textString}
            readOnly={true} />
        </div>
      </Popover>
    </div>
  )
}
