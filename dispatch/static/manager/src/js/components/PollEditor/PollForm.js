import React from 'react'
import { Button, Intent } from '@blueprintjs/core'

import { FormInput, TextInput } from '../inputs'
import Poll from './Poll'
import SelectInput from '../inputs/selects/SelectInput'

require('../../../styles/components/poll_form.scss')

export default class PollForm extends React.Component {

  constructor(props) {
    super(props)
    //Ids are set to be negative to avoid clashing with the database ids
    if(props.listItem.id === 'new') {
      this.state = {
        answers : [
          {
            'id': -1,
            'name': '',
            'votes': [],
            'vote_count': 0
          },
          {
            'id': -2,
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
    let answers = this.state.answers

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
    let answers = this.state.answers
    answers.splice(id, 1)
    this.props.update('answers', answers)
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
            <span
              className={['poll-form', 'pt-icon-standard', 'pt-icon-trash'].join(' ')}
              onClick={() => this.removeAnswer(id)}>
              <span className={'pt-icon-standard-text'}>Remove answer</span>
            </span>
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

  renderPollOpenSelect() {
    const OPTIONS = [
      [true, 'Poll Open'],
      [false, 'Poll Closed']
    ]

    return (
      <FormInput
        label='Poll Options'
        padded={false}>
        <div className='c-poll-form__results-select'>
          <SelectInput
            options={OPTIONS}
            selected={this.props.listItem.is_open}
            onChange={e => this.props.update('is_open', e.target.value)}/>
        </div>
      </FormInput>
    )
  }

  renderOptions() {
    const OPTIONS = [
      [true, 'Show results'],
      [false, 'Hide results']
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
        {(this.props.listItem.id === 'new') ? null : this.renderPollOpenSelect()}
      </div>
    )
  }

  render() {
    return (
      <div className={'c-poll-form-container'}>
        <div className={'c-equal-width'}>
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
        </div>
        <div className={'c-equal-width'}>
          <Poll
            many={false}
            id={this.props.listItem.id}
            answers={this.props.listItem.answers}
            question={this.props.listItem.question}
            />
        </div>

        <div>
        </div>
      </div>
    )
  }
}
