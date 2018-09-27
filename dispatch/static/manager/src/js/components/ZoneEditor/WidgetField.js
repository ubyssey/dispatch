import React from 'react'

import * as fields from '../fields'
import * as Form from '../Form'

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
    <Form.Input
      error={fieldError}
      label={props.field.label}>
      <Field
        errors={childErrors}
        field={props.field}
        data={props.data}
        onChange={props.onChange} />
    </Form.Input>
  )

}
