import React from 'react'

import PollSelectInput from '../../../components/inputs/selects/PollSelectInput'
import { FormInput } from '../../../components/inputs'

function PollEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--poll'>
      <form>
        <FormInput label='Poll'>
        <PollSelectInput
          fill={true}
          selected={props.data.poll}
          onChange={selected => {
            props.updateField('poll',selected)
            props.stopEditing()
          }
        } />
        </FormInput>
      </form>
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
