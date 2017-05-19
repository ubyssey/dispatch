import React from 'react'

import WidgetSelectInput from '../inputs/WidgetSelectInput'

import { FormInput } from '../inputs'

export default function WidgetSelector(props) {
  return (
    <FormInput>
      <WidgetSelectInput
        zoneId={props.zoneId}
        selected={props.selected}
        update={widget => props.update(widget)} />
    </FormInput>
  )
}
