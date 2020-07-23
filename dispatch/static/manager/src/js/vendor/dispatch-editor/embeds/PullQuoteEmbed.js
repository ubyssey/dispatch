import React from 'react'

import { TextInput } from '../../../components/inputs'
import { SelectInput } from '../../../components/inputs'
import * as Form from '../../../components/Form'

const MODES = [
  ['regular', 'regular'],
  ['left', 'left'],
  ['right', 'right']
]

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
      <div className='o-embed--code__footer'>
        <div className='o-embed--code__mode'>
          <SelectInput
            options={MODES}
            value={props.data.type}
            onChange={(e) => props.updateField('type', e.target.value)} />
        </div>
      </div>
    </div>
  )
}

export default {
  type: 'quote',
  component: PullQuoteEmbedComponent,
  defaultData: {
    content: '',
    source: '',
    type: 'regular'
  }
}
