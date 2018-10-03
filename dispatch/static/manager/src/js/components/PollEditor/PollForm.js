import React from 'react'
import { Button, Intent } from '@blueprintjs/core'
import R from 'ramda'

import { TextInput, SelectInput } from '../inputs'

import * as Form from '../Form'

import Poll from './Poll'

require('../../../styles/components/poll_form.scss')

const DEFAULT_ANSWERS = [
  {
    'name': '',
    'vote_count': 0
  },
  {
    'name': '',
    'vote_count': 0
  }
]

export default class PollForm extends React.Component {

  addAnswer() {
    this.props.update('answers', this.getAnswers().concat(DEFAULT_ANSWERS[0]))
  }

  removeAnswer(index) {
    this.props.update('answers', R.remove(index, 1, this.getAnswers()))
  }

  handleUpdateAnswer(e, index) {
    this.props.update('answers',
      R.adjust(R.assoc('name', e.target.value), index, this.getAnswers())
    )
  }

  getAnswers() {
    return this.props.listItem.answers || DEFAULT_ANSWERS
  }

  renderAnswers() {
    const answers = this.getAnswers().map(
      (answer, index) => {
        return (
          <Form.Input
            key={index + 1}
            label={`Answer ${index + 1} Votes: ${answer.vote_count}`}
            padded={false}>
            <TextInput
              placeholder='Answer'
              value={answer.name || ''}
              fill={true}
              onChange={e => this.handleUpdateAnswer(e, index)} />
            <span
              className={['poll-form', 'bp3-icon-standard', 'bp3-icon-trash'].join(' ')}
              onClick={() => this.removeAnswer(index)}>
              <span className={'bp3-icon-standard-text'}>Remove answer</span>
            </span>
          </Form.Input>
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
      <Form.Input
        label='Poll Options'
        padded={false}>
        <div className='c-poll-form__results-select'>
          <SelectInput
            options={OPTIONS}
            value={this.props.listItem.is_open}
            onChange={e => this.props.update('is_open', e.target.value)} />
        </div>
      </Form.Input>
    )
  }

  renderOptions() {
    const OPTIONS = [
      [true, 'Show results'],
      [false, 'Hide results']
    ]

    return (
      <div>
        <Form.Input
          label='Results Options'
          padded={false}>
          <div className='c-poll-form__results-select'>
            <SelectInput
              options={OPTIONS}
              value={this.props.listItem.show_results}
              onChange={e => this.props.update('show_results', e.target.value)} />
          </div>
        </Form.Input>
        {(this.props.listItem.id === 'new') ? null : this.renderPollOpenSelect()}
      </div>
    )
  }

  render() {
    return (
      <div className={'c-poll-form-container'}>
        <div className={'c-equal-width'}>
          <Form.Container>

            <Form.Input
              label='Name'
              padded={false}
              error={this.props.errors.name}>
              <TextInput
                placeholder='Name'
                value={this.props.listItem.name || ''}
                fill={true}
                onChange={e => this.props.update('name', e.target.value)} />
            </Form.Input>

            <Form.Input
              label='Question'
              padded={false}
              error={this.props.errors.question}>
              <TextInput
                placeholder='Question'
                value={this.props.listItem.question || ''}
                fill={true}
                onChange={e => this.props.update('question', e.target.value)} />
            </Form.Input>

            {this.renderAnswers()}
            {this.renderAddAnswerButton()}
            {this.renderOptions()}
            
          </Form.Container>
        </div>
        <div className={'c-equal-width'}>
          <Poll
            many={false}
            id={this.props.listItem.id}
            answers={this.props.listItem.answers}
            question={this.props.listItem.question} />
        </div>
      </div>
    )
  }
}
