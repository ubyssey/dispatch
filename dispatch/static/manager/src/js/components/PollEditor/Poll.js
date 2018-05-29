import React, { Component } from 'react'
import { Button, Intent } from '@blueprintjs/core'

require('../../../styles/components/poll.scss')

const COLOR_OPACITY = .8

class Poll extends Component {
  constructor(props){
    super(props)
    this.state = {
      answers: [],
      votes: [],
      voting: false,
      pollQuestion: this.props.question,
      loading: true,
    }
  }

  componentDidMount() {
    let answers = []
    let votes = []
    for(let answer of this.props.answers){
      answers.push(answer['name'])
      votes.push(answer['vote_count'])
    }
    this.setState({
      answers: answers,
      votes: votes,
      loading: false,
    })
    this.forceUpdate()
  }

  getPollResult(index) {
    if(!this.state.voting){
      let total = this.state.votes.reduce((acc, val) => { return acc + val })
      let width = String((100*this.state.votes[index]/total).toFixed(0)) + '%'
      return width
    }
    return 0
  }

  toggleResults() {
    this.setState(prevstate => ({
      voting: !prevstate.voting
    }))
  }

  render() {
    const showResult = this.state.voting ?  0 : COLOR_OPACITY
    const notShowResult = this.state.voting ? COLOR_OPACITY : 0
    return (
      <div>
        {!this.state.loading &&
          <div>
            <div className={['poll-container', 'poll-results'].join(' ')}>
              <h1>{this.state.pollQuestion}</h1>
              <form className={'poll-answer-form'}>
                {this.state.answers.map((answer, index) => {
                  return(
                    <label key={index} className={['poll-button-label', 'poll-button-voted'].join(' ')}>
                      <input className={'poll-input'} 
                        name={'answer'} 
                        type={'radio'} 
                        value={answer} />
                        <span className={'poll-answer-text'}>{answer}</span>
                      {/* </input> */}

                      <span className={'poll-button'}
                        style={{opacity: notShowResult}}>
                        <span className={'poll-button-inner'}></span>
                      </span>

                      <span className={'poll-percentage'}
                        style={{opacity: showResult}}>
                        {this.getPollResult(index)}
                      </span>

                      <div className={'poll-result-bar'} 
                        style={{width: this.getPollResult(index), opacity: showResult}}>
                      </div>

                    </label>
                  )})
                }
              </form>
            </div>
            <Button 
              className={'poll-edit-button'} 
              intent={Intent.SUCCESS}
              onClick={() => this.toggleResults()}>
              Toggle Results View
            </Button>  
          </div>
        }
        {this.state.loading && 'Loading Poll...'}
      </div>
    )
  }
}

export default Poll
