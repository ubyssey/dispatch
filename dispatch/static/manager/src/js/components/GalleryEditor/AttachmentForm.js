import React from 'react'

import { TextInput } from '../inputs'

import * as Form from '../Form'

export default function AttachmentForm(props) {

  return (
    <Form.Container>

      <Form.Input label='Caption'>
        <TextInput
          placeholder='Caption'
          value={props.caption || ''}
          fill={true}
          onChange={e => props.update('caption', e.target.value)} />
      </Form.Input>

      <Form.Input label='Credit'>
        <TextInput
          placeholder='Credit'
          value={props.credit || ''}
          fill={true}
          onChange={e => props.update('credit', e.target.value)} />
      </Form.Input>

    </Form.Container>
  )
}
