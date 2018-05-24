import React from 'react'

import { FormInput, TextInput } from '../inputs'


export default class PollForm extends React.Component {
  listPolls(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPolls(this.props.token, queryObj)
  }


  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <FormInput
          label='Question'
          padded={false}
          error={this.props.errors.question}>
          <TextInput
            placeholder='Question'
            value={this.props.listItem.question || ''}
            fill={true}
            onChange={ e => this.props.update('question', e.target.value) } />
        </FormInput>
        <FormInput
          label='Option'
          padded={false}
          error={this.props.errors.option}>
          <TextInput
            placeholder='Option'
            value={this.props.listItem.option || ''}
            fill={true}
            onChange={ e => this.props.update('option', e.target.value) } />
        </FormInput>
      </form>
    )
  }
}
