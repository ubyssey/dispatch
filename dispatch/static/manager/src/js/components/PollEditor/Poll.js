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
      showResults: true,
      pollQuestion: '',
      loading: true,
      noVotes: false,
    }
  }

  componentDidMount() {
    this.update()
    this.forceUpdate()
  }

  componentDidUpdate() {
    this.update()
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state.showResults !== nextState.showResults){
      return true
    }
    if(this.props.answers.length === nextProps.answers.length){
      setTimeout(()=> {
        this.forceUpdate()
      }, 250)
      return false
    }
    return true
  }

  update() {
    let answers = []
    let votes = []
    for(let answer of this.props.answers){
      answers.push(answer['name'])
      votes.push(answer['vote_count'])
    }
    let temp = votes.filter((item) => {return item === 0})
    let noVotes = false
    if(temp.length === votes.length){
      //no votes yet, populate with dummy data for better pole visualization
      votes[0] = 2
      votes[1] = 1
      noVotes = true
    }
    this.setState({
      answers: answers,
      votes: votes,
      loading: false,
      pollQuestion: this.props.question,
      noVotes: noVotes,
    })
  }

  getPollResult(index) {

    if(this.state.showResults){
      let width = 0
      let total = this.state.votes.reduce((acc, val) => { return acc + val })

      if(total !== 0){
        width = String((100*this.state.votes[index]/total).toFixed(0)) + '%'
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

  componentWillReceiveProps(nextProps){
    if(this.props !== nextProps){
      this.forceUpdate()
    }
  }

  render() {
    const notShowResult= this.state.showResults ?  0 : COLOR_OPACITY
    const showResult = this.state.showResults ? COLOR_OPACITY : 0
    return (
      <div>
        {!this.state.loading &&
          <div className={'poll-preview'}>
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
            {this.state.noVotes && <i>No votes yet, poll data above is for visualization purposes only!</i>}
            <br/>
            <Button 
              className={'poll-results-button'}
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
