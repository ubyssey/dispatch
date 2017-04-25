import React from 'react'

import { FormInput, TextInput } from '../inputs'

export default function SectionForm(props) {

  return (
    <form>

      <FormInput
        label='Name'
        error={props.errors.name}>
        <TextInput
          placeholder='Name'
          value={props.section.name || ''}
          fill={true}
          onChange={ e => props.update('name', e.target.value) } />
      </FormInput>

      <FormInput
        label='Slug'
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.section.slug || ''}
          fill={true}
          onChange={ e => props.update('slug', e.target.value) } />
      </FormInput>

    </form>
  )
}
