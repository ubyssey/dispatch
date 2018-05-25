import React from 'react'
import { Button, Intent } from '@blueprintjs/core'

import { FormInput, TextInput } from '../inputs'


export default class PollForm extends React.Component {
  listPolls(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPolls(this.props.token, queryObj)
  }

  addAnswer() {
    let answers = this.props.listItem.answers || []
    let id = answers.length
    let answer = {
      'id': id,
      'name': '',
      'votes': [],
      'vote_count': 0
    }
    answers.push(answer)
    this.props.update('answers', answers)
  }

  handleUpdateAnswer(id, e) {
    var answers = this.props.listItem.answers
    for(var i = 0; i < answers.length; i++) {
      if(answers[i].id === id){
        answers[i].name = e.target.value
      }
    }
    this.props.update('answers', answers)
  }


  renderAnswers() {
    let answers = this.props.listItem.answers.map(
      (answer, index) => {
        let name = answer.name
        let votes = answer.vote_count
        let id = index + 1

        return (
          <FormInput
            key={id}
            label={'Answer '+id+' Votes: '+votes}
            padded={false}>
            <TextInput
              placeholder='Answer'
              value={name || ''}
              fill={true}
              onChange={ e => this.handleUpdateAnswer(answer.id, e) } />
          </FormInput>
        )
      }
    )
    return (
      <div>
        {answers}
      </div>
    )
  }

  renderAddAnswerButton() {
    return (
      <Button
        intent={Intent.SUCCESS}
        onClick={() => this.addAnswer()}>
        Add answer
      </Button>
    )
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
        {this.props.listItem.answers ? this.renderAnswers() : null}
        {this.renderAddAnswerButton()}
      </form>
    )
  }
}
