import React from 'react'

import { TextInput } from '../inputs'

import * as Form from '../Form'

export default function TagForm(props) {

  return (
    <Form.Container>

      <Form.Input
        label='Name'
        error={props.errors.name}>
        <TextInput
          placeholder='Name'
          value={props.listItem.name || ''}
          fill={true}
          onChange={e => props.update('name', e.target.value)} />
      </Form.Input>

    </Form.Container>
  )
}
