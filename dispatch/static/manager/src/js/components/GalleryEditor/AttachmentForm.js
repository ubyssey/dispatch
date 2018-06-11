import React from 'react'

import { FormInput, TextInput } from '../inputs'

export default function AttachmentForm(props) {

  return (
    <form style={{ padding: 15 }}>

      <FormInput
        label='Caption'
        padded={false}>
        <TextInput
          placeholder='Caption'
          value={props.caption || ''}
          fill={true}
          onChange={e => props.update('caption', e.target.value)} />
      </FormInput>

      <FormInput
        label='Credit'
        padded={false}>
        <TextInput
          placeholder='Credit'
          value={props.credit || ''}
          fill={true}
          onChange={e => props.update('credit', e.target.value)} />
      </FormInput>

    </form>
  )
}
