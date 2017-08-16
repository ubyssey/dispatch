import React from 'react'

import * as fields from '../fields'

import { FormInput } from '../inputs'

export default function WidgetField(props) {
  const Field = fields[props.field.type]

  let fieldError = ''
  let childErrors = null
  if (props.field.type == 'widget' && props.error) {
    try {
      childErrors = JSON.parse(props.error)
      fieldError = childErrors.self
    } catch (e) {
      fieldError = props.error
    }
  } else {
    fieldError = props.error
  }

  return (
    <FormInput
      error={fieldError}
      label={props.field.label}>
      <Field
        errors={childErrors}
        label={props.field.label}
        many={props.field.many}
        data={props.data}
        compatibleWidgets={props.field.widgets}
        onChange={props.onChange} />
    </FormInput>
  )

}
