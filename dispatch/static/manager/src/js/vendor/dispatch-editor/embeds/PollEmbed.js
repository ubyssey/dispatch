import React from 'react'

import PollSelectInput from '../../../components/inputs/selects/PollSelectInput'

import * as Form from '../../../components/Form'

function PollEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--poll'>
      <Form.Container>
        <Form.Input label='Poll'>
          <PollSelectInput
            fill={true}
            selected={props.data.poll}
            onChange={selected => {
              props.updateField('poll',selected)
              props.stopEditing()
            }} />
        </Form.Input>
      </Form.Container>
    </div>
  )
}

export default {
  type: 'poll',
  component: PollEmbedComponent,
  defaultData: {
    poll:'',
    widget_id: 'poll'
  }
}
