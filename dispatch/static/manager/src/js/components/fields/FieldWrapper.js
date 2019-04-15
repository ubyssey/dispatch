import React from 'react'

import * as fields from '../fields'

import * as Form from '../Form'

export default function FieldWrapper(props) {
  const Field = fields[props.field.type]
  const errors = getErrors(props.field, props.error)

  return (
    <Form.Input
      error={errors.error}
      label={props.field.label}>
      <Field
        errors={errors.childErrors}
        field={props.field}
        data={props.data}
        onChange={props.onChange} />
    </Form.Input>
  )
}

function getErrors(field, error) {
  let childErrors = null
  if (field.type == 'widget' && error) {
    try {
      childErrors = JSON.parse(error)
      error = childErrors.self
    } catch (e) {
      // No child errors
    }
  }

  return {
    error: error,
    childErrors: childErrors
  }
}
