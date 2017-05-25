import React from 'react'

import { FormInput, TextInput, TextAreaInput } from '../../inputs'

export default function BasicFieldsTab(props) {

  return (
    <div>

      <FormInput
        label='Slug'
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value) } />
      </FormInput>

      <FormInput
        label='Snippet'
        error={props.errors.snippet}>
        <TextAreaInput
          placeholder='Snippet'
          value={props.snippet || ''}
          rows='5'
          onChange={e => props.update('snippet', e.target.value) } />
      </FormInput>

    </div>
  )

}
