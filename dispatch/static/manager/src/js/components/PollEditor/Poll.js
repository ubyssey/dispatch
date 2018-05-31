import React, { Component } from 'react'
import { Button, Intent } from '@blueprintjs/core'

require('../../../styles/components/poll.scss')

const COLOR_OPACITY = .8

class Poll extends Component {
  constructor(props){
    super(props)
    this.state = {
      showResults: true,
    }
  }

  componentDidMount() {
    this.update()
  }

  update() {
    let answers = []
    let votes = []
    let pollQuestion = this.props.question ? this.props.question : 'Poll Question'
    if(this.props.answers){
      for(let answer of this.props.answers){
        answers.push(answer['name'])
        votes.push(answer['vote_count'])
      }
    } else {
      answers.push('First answer')
      answers.push('Second answer')
    }

    let temp = votes.filter((item) => {return item === 0})
    let noVotes = false
    if(temp.length === votes.length){
      //no votes yet, populate with dummy data for better poll visualization
      votes[0] = 2
      votes[1] = 1
      noVotes = true
    }
    console.log(answers, votes, noVotes)
    return {
      answers: answers,
      votes: votes,
      loading: false,
      pollQuestion: pollQuestion,
      noVotes: noVotes,
    }
  }

  getPollResult(index, votes) {
    if(this.state.showResults){
      let width = 0
      let total = votes.reduce((acc, val) => { return acc + val })
      console.log(total)
      if(total !== 0){
        width = String((100*votes[index]/total).toFixed(0)) + '%'
      }
      
      return width
    }
    return 0
  }

  toggleResults() {
    this.setState(prevstate => ({
      showResults: !prevstate.showResults
    }))
  }

  render() {
    const { answers, votes, loading, pollQuestion, noVotes } = this.update()

    const notShowResult= this.state.showResults ?  0 : COLOR_OPACITY
    const showResult = this.state.showResults ? COLOR_OPACITY : 0
    return (
      <div>
        {!loading &&
          <div className={'poll-preview'}>
            <div className={['poll-container', 'poll-results'].join(' ')}>
              <h1>{pollQuestion}</h1>
              <form className={'poll-answer-form'}>
                {answers.map((answer, index) => {
                  return(
                    <label key={index} className={['poll-button-label', 'poll-button-voted'].join(' ')}>
                      <input className={'poll-input'} 
                        name={'answer'} 
                        type={'radio'} 
                        value={answer} />
                        <span className={'poll-answer-text'}>{answer}</span>

                      <span className={'poll-button'}
                        style={{opacity: notShowResult}}>
                        <span className={'poll-button-inner'}></span>
                      </span>

                      <span className={'poll-percentage'}
                        style={{opacity: showResult}}>
                        {this.getPollResult(index, votes)}
                      </span>

                      <div className={'poll-result-bar'} 
                        style={{width: this.getPollResult(index, votes), opacity: showResult}}>
                      </div>

                    </label>
                  )})
                }
              </form>
            </div>
            {noVotes && <i>No votes yet, poll data above is for visualization purposes only!</i>}
            <br/>
            <Button 
              className={'poll-results-button'}
              intent={Intent.SUCCESS}
              onClick={() => this.toggleResults()}>
              Toggle Results View
            </Button> 
          </div>
        }
        {loading && 'Loading Poll...'}
      </div>
    )
  }
}

export default Poll
