import React from 'react'
import { Button, Intent } from '@blueprintjs/core'

require('../../../styles/components/poll.scss')

const COLOR_OPACITY = .8

class Poll extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      showResults: true,
    }
  }

  getPollResult(voteCount) {
    const total = this.props.answers.reduce((acc, answer) => acc + answer.vote_count, 0)

    if (this.state.showResults && total) {
      return String((100*voteCount/total).toFixed(0)) + '%'
    }

    return 0
  }

  toggleResults() {
    this.setState(prevstate => ({
      showResults: !prevstate.showResults
    }))
  }

  render() {
    const { answers, question } = this.props
    const notShowResult= this.state.showResults ?  0 : COLOR_OPACITY
    const showResult = this.state.showResults ? COLOR_OPACITY : 0
    return (
      <div>
        <div className='poll-preview'>
          <div className='poll-container poll-results'>
            <h1>{question}</h1>
            <form className='poll-answer-form'>
              {answers.map((answer, index) => {
                return (
                  <label key={index} className='poll-button-label poll-button-voted'>
                    <input
                      className='poll-input'
                      name='answer'
                      type='radio'
                      value={answer.name} />
                      <span className='poll-answer-text'>{answer.name}</span>

                    <span
                      className='poll-button'
                      style={{opacity: notShowResult}}>
                      <span className='poll-button-inner' />
                    </span>

                    <span
                      className='poll-percentage'
                      style={{opacity: showResult}}>
                      {this.getPollResult(answer.vote_count)}
                    </span>

                    <div
                      className='poll-result-bar'
                      style={{width: this.getPollResult(answer.vote_count), opacity: showResult}} />

                  </label>
                )})
              }
            </form>
          </div>
          <Button
            className='poll-results-button'
            intent={Intent.SUCCESS}
            onClick={() => this.toggleResults()}>
            Toggle Results View
          </Button>
        </div>
      </div>
    )
  }
}

Poll.defaultProps = {
  question: 'Default question',
  answers: [
    {
      name: 'Answer 1',
      vote_count: 2,
      votes: []
    },
    {
      name: 'Answer 2',
      vote_count: 1,
      votes: []
    },
  ]
}

export default Poll
