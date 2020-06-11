import React from 'react'
import { TextInput } from '../../../components/inputs'

import * as Form from '../../../components/Form'

function DropCapEmbedComponent(props) {
  return (
    <div className='drop-cap'>
      <Form.Container>
        <Form.Input label='Dropcap paragraph'>
        <TextInput
            fill={true}
            value={props.data.paragraph}
            onChange={e => props.updateField('paragraph', e.target.value)} />
        </Form.Input>
      </Form.Container>
    </div>
  )
}


export default {
  type: 'dropcap',
  component: DropCapEmbedComponent,
  defaultData: {
    paragraph: ''
  }
}

