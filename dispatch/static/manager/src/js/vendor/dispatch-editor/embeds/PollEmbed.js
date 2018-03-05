import React from 'react'

import { FormInput, TextInput } from '../../../components/inputs'

function PollEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--poll'>
      <form>
        <FormInput label='Question'>
          <TextInput
            fill={true}
            value={props.data.question}
            onChange={e => props.updateField('question', e.target.value)} />
        </FormInput>
        <FormInput label='Choice #1'>
          <TextInput
            fill={true}
            value={props.data.choice1 || ''}
            onChange={e => props.updateField('choice1', e.target.value)} />
        </FormInput>
        <FormInput label='Choice #2'>
          <TextInput
            fill={true}
            value={props.data.choice2 || ''}
            onChange={e => props.updateField('choice2', e.target.value)} />
        </FormInput>
        <FormInput label='Choice #3'>
          <TextInput
            fill={true}
            value={props.data.choice3 || ''}
            onChange={e => props.updateField('choice3', e.target.value)} />
        </FormInput>
        <FormInput label='Choice #4'>
          <TextInput
            fill={true}
            value={props.data.choice4 || ''}
            onChange={e => props.updateField('choice4', e.target.value)} />
        </FormInput>
        <FormInput label='Choice #5'>
          <TextInput
            fill={true}
            value={props.data.choice5 || ''}
            onChange={e => props.updateField('choice5', e.target.value)} />
        </FormInput>
      </form>
    </div>
  )
}

export default {
  type: 'poll',
  component: PollEmbedComponent,
  defaultData: {
    question: '',
    choice1: '',
    choice2: '',
    choice3: '',
    choice4: '',
    choice5: ''
  }
}
