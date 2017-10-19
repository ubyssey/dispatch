import React from 'react'

import { FormInput, TextInput } from '../../../components/inputs'

function TwitterEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--quote'>
      <form>
        <FormInput label='Tweet URL'>
          <TextInput
            fill={true}
            value={props.data.url}
            onChange={e => props.updateField('url', e.target.value)} />
        </FormInput>
      </form>
    </div>
  )
}

export default {
  type: 'tweet',
  component: TwitterEmbedComponent,
  defaultData: {
    url: ''
  }
}