import React from 'react'

import * as fields from '../fields'

import { FormInput } from '../inputs'

export default function WidgetField(props) {

  const Field = fields[props.field.type]

  return (
    <FormInput
      label={props.field.label}
      padded={false}>
      <Field
        label={props.field.label}
        data={props.data}
        onChange={props.onChange} />
    </FormInput>
  )

}
