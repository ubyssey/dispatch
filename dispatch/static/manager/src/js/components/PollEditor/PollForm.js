import React from 'react'
import { Button, Intent } from '@blueprintjs/core'

import { FormInput, TextInput } from '../inputs'
import SelectInput from '../inputs/selects/SelectInput'

require('../../../styles/components/poll_form.scss')

export default class PollForm extends React.Component {
  listPolls(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPolls(this.props.token, queryObj)
  }

  constructor(props){
    super(props)
    if(props.listItem.id === 'new') {
      this.state = {
        answers : [
          {
            'id': 0,
            'name': '',
            'votes': [],
            'vote_count': 0
          },
          {
            'id': 1,
            'name': '',
            'votes': [],
            'vote_count': 0
          }
        ]
      }
    }
    else {
      this.state = {
        answers: props.listItem.answers
      }
    }
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
    var answers = this.state.answers
    for(var i = 0; i < answers.length; i++) {
      if(answers[i].id === id){
        answers[i].name = e.target.value
      }
    }
    this.props.update('answers', answers)
  }

  openPoll() {
    this.props.update('is_open', true)
  }

  closePoll() {
    this.props.update('is_open', false)
  }

  renderAnswers() {
    let answers = this.state.answers.map(
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

  renderPollToggle() {
    if (this.props.listItem.is_open) {
      return (
        <Button
          intent={Intent.DANGER}
          onClick={() => this.closePoll()}>
          Close Poll
        </Button>
      )
    }
    else
      return (
        <Button
          intent={Intent.SUCCESS}
          onClick={() => this.openPoll()}>
          Open Poll
        </Button>
      )
  }

  renderOptions() {
    const OPTIONS = [
      [true, 'Show results'],
      [false, 'Hide results'],
    ]

    return (
      <div>
        <FormInput
          label='Results Options'
          padded={false}>
          <div className='c-poll-form__results-select'>
            <SelectInput
              options={OPTIONS}
              selected={this.props.listItem.show_results}
              onChange={e => this.props.update('show_results', e.target.value)}/>
          </div>
        </FormInput>
        {(this.props.listItem.id === 'new') ? null : this.renderPollToggle()}
      </div>
    )
  }

  render() {
    return (
      <div>
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
          {this.renderAnswers()}
          {this.renderAddAnswerButton()}
          {this.renderOptions()}
        </form>
        <div>
        </div>
      </div>
    )
  }
}
