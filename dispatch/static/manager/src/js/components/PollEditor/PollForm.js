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

    let id = answers[answers.length - 1] ? answers[answers.length - 1].id + 1 : 1
    let answer = {
      'id': id,
      'name': '',
      'votes': [],
      'vote_count': 0
    }
    answers.push(answer)
    this.props.update('answers', answers)
  }

  removeAnswer(id) {
    var answers = this.props.listItem.answers
    answers.splice(id, 1)
    this.props.update('answer', answers)
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
        let key = index + 1
        let id = index
        return (
          <FormInput
            key={key}
            label={'Answer '+key+' Votes: '+votes}
            padded={false}>
            <TextInput
              placeholder='Answer'
              value={name || ''}
              fill={true}
              onChange={ e => this.handleUpdateAnswer(answer.id, e) } />
            <Button
              intent={Intent.DANGER}
              onClick={() => this.removeAnswer(id)}>
              Remove answer
            </Button>
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
          label='Name'
          padded={false}
          error={this.props.errors.name}>
          <TextInput
            placeholder='Name'
            value={this.props.listItem.name || ''}
            fill={true}
            onChange={ e => this.props.update('name', e.target.value) } />
        </FormInput>
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
