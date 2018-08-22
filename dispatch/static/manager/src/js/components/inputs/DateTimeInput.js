import React from 'react'
import { Popover, Position, Button } from '@blueprintjs/core'
import { DatePicker, DateTimePicker } from '@blueprintjs/datetime'

import { humanizeDatetime } from '../../util/helpers'

const TODAY = new Date()
const MIN_DATE = new Date(0)
const MAX_DATE = new Date(TODAY.getFullYear()+1, 12, 31)

function ensureDate(date) {
  let ret = date
  if (!(date instanceof Date)) {
    const time_ms = Date.parse(date)
    if (isNaN(time_ms)) {
      ret = null
    } else {
      ret = new Date(time_ms)
    }
  }
  return ret
}

export default function DateTimeInput(props) {
  const date = ensureDate(props.value)

  const selectString = props.showTimePicker ?
    'Select a date and time...' :
    'Select a date...'

  const textString = date ?
    humanizeDatetime(date, props.showTimePicker) :
    selectString

  const picker = props.showTimePicker ? (
    <DateTimePicker
      value={date || new Date()}
      onChange={props.onChange}
      timePickerProps={{
        onChange: props.onChange,
        precision: 'second',
        useAmPm: true
      }}
      datePickerProps={{
        minDate: MIN_DATE,
        maxDate: MAX_DATE,
      }} />
  ) : (
    <DatePicker
      value={date || new Date()}
      onChange={props.onChange}
      datePickerProps={{
        minDate: MIN_DATE,
        maxDate: MAX_DATE,
        showActionsBar: true
      }} />
  )

  return (
    <div className='c-input--datetime'>
      <Popover
        content={picker}
        position={props.position || Position.TOP}>
        <div className='bp3-control-group'>
          <Button
            icon='calendar'
            className='c-input--datetime-button'
            onClick={e => e.preventDefault()} />
          <input
            type='text'
            className='bp3-input c-input--datetime--textfield'
            value={textString}
            readOnly={true} />
        </div>
      </Popover>
    </div>
  )
}

DateTimeInput.defaultProps = {
  showTimePicker: true
}
