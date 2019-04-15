import React from 'react'

import { TextInput, TextAreaInput } from '../../inputs'

import * as Form from '../../Form'

export default function BasicFieldsTab(props) {

  return (
    <div className='c-article-sidebar__panel'>

      <Form.Input
        label='Slug'
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Snippet'
        error={props.errors.snippet}>
        <TextAreaInput
          placeholder='Snippet'
          value={props.snippet || ''}
          rows='5'
          onChange={e => props.update('snippet', e.target.value)} />
      </Form.Input>

    </div>
  )

}
