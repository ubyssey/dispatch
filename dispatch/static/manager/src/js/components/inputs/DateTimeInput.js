import React from 'react'
import { Popover, Position } from '@blueprintjs/core'
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
        selectAllOnFocus: true,
        showArrowButtons: true
      }}
      datePickerProps={{
        minDate: MIN_DATE,
        maxDate: MAX_DATE,
        showActionsBar: true
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

DateTimeInput.defaultProps = {
  showTimePicker: true
}
