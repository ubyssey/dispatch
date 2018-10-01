import React from 'react'

import { TextInput } from '../inputs'

import * as Form from '../Form'

export default function SectionForm(props) {

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

      <Form.Input
        label='Slug'
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.listItem.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value)} />
      </Form.Input>

    </Form.Container>
  )
}
