import React from 'react'

import { FormInput, TextInput } from '../inputs'

export default function ColumnForm(props) {

  return (
    <form>

      <FormInput
        label='Name'
        padded={false}
        error={props.errors.name}>
        <TextInput
          placeholder='Name'
          value={props.listItem.name || ''}
          fill={true}
          onChange={e => props.update('name', e.target.value)} />
      </FormInput>

      <FormInput
        label='Slug'
        padded={false}
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.listItem.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value)} />
      </FormInput>

    </form>
  )
}
