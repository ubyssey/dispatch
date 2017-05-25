import React from 'react'

import { FormInput, TextInput } from '../inputs'

export default function TopicForm(props) {

  return (
    <form onSubmit={e => e.preventDefault()}>
      <FormInput
        label='Name'
        padded={false}
        error={props.errors.name}>
        <TextInput
          placeholder='Name'
          value={props.listItem.name || ''}
          fill={true}
          onChange={ e => props.update('name', e.target.value) } />
      </FormInput>
    </form>
  )
}
