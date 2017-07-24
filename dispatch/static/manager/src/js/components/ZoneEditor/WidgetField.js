import React from 'react'

import * as fields from '../fields'

import { FormInput } from '../inputs'

export default function WidgetField(props) {
  const Field = fields[props.field.type]

  return (
    <FormInput
      error={props.error}
      label={props.field.label}>
      <Field
        label={props.field.label}
        many={props.field.many}
        data={props.data}
        onChange={props.onChange} />
    </FormInput>
  )

}
