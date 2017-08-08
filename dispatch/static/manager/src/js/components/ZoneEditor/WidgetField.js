import React from 'react'

import * as fields from '../fields'

import { FormInput } from '../inputs'

export default function WidgetField(props) {
  const Field = fields[props.field.type]

  let error = ''
  let errors = null
  if (props.field.type == 'widget' && props.error) {
    try {
      errors = JSON.parse(props.error)
      error = errors.self
    } catch (e) {
      error = props.error
    }
  } else {
    error = props.error
  }

  return (
    <FormInput
      error={error}
      label={props.field.label}>
      <Field
        errors={errors}
        label={props.field.label}
        many={props.field.many}
        data={props.data}
        zone_id={props.field.zone_id}
        onChange={props.onChange} />
    </FormInput>
  )

}
