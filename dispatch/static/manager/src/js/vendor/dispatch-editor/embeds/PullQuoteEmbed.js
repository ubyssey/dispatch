import React from 'react'

import { TextInput } from '../../../components/inputs'

import * as Form from '../../../components/Form'

function PullQuoteEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--quote'>
      <Form.Container>
        <Form.Input label='Content'>
          <TextInput
            fill={true}
            value={props.data.content}
            onChange={e => props.updateField('content', e.target.value)} />
        </Form.Input>
        <Form.Input label='Source'>
          <TextInput
            fill={true}
            value={props.data.source || ''}
            onChange={e => props.updateField('source', e.target.value)} />
        </Form.Input>
      </Form.Container>
    </div>
  )
}

export default {
  type: 'quote',
  component: PullQuoteEmbedComponent,
  defaultData: {
    content: '',
    source: ''
  }
}
