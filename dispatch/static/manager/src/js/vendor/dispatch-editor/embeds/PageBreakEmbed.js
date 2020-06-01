import React from 'react'
import { TextInput } from '../../../components/inputs'

import * as Form from '../../../components/Form'

function PageBreakEmbedComponent(props) {
  return (
    <div className='page-break'>
      <Form.Container>
        <Form.Input label='Page break'>
        </Form.Input>
      </Form.Container>
    </div>
  )
}


export default {
  type: 'pagebreak',
  component: PageBreakEmbedComponent,
}

