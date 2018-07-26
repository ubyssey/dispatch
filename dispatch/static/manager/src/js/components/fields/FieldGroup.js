import React from 'react'
import R from 'ramda'

import Panel from '../Panel'

import FieldWrapper from './FieldWrapper'

export default function FieldGroup(props) {
  if (!props.fields) {
    return null
  }
  
  const fields = props.fields.map((field) => (
    <FieldWrapper
      key={`${props.name}__${field.name}`}
      field={field}
      error={props.errors ? props.errors[field.name] : null}
      data={R.prop(field.name, props.data || {}) || null}
      onChange={(data) => props.onChange(field.name, data)} />
  ))

  if (props.title) {
    return (
      <Panel title={props.title}>
        {      
          <div>
            {
              fields.map(field => {
                return field
              })
            }
          </div>
        }
      </Panel>
    )
  }

  return <div>
      {
        fields.map(field => {
          return field
        })
      }
    </div>

}
