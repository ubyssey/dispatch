import React from 'react'

import { FormInput, TextInput } from '../../../components/inputs'

function PullQuoteEmbedComponent(props) {

  return (
    <div className='o-embed o-embed--quote'>
      <form>
        <FormInput label='Content'>
          <TextInput
            fill={true}
            value={props.data.content}
            onChange={e => props.updateField('content', e.target.value)} />
        </FormInput>
        <FormInput label='Source'>
          <TextInput
            fill={true}
            value={props.data.source || ''}
            onChange={e => props.updateField('source', e.target.value)} />
        </FormInput>
      </form>
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
