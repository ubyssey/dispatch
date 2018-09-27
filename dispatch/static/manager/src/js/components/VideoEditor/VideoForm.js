import React from 'react'

import { TextInput } from '../inputs'

import * as Form from '../Form'

export default function VideoForm(props) {

  return (
    <Form.Container>

      <Form.Input
        label='Title'
        error={props.errors.title}>
        <TextInput
          placeholder='Title'
          value={props.listItem.title || ''}
          fill={true}
          onChange={e => props.update('title', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='URL'
        error={props.errors.url}>
        <TextInput
          placeholder='URL'
          value={props.listItem.url || ''}
          fill={true}
          onChange={e => props.update('url', e.target.value)} />
      </Form.Input>

    </Form.Container>
  )
}
