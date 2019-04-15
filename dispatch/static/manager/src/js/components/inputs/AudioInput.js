import React from 'react'
import { connect } from 'react-redux'
import { ProgressBar } from '@blueprintjs/core'

import FileInput from './FileInput'

class AudioInputComponent extends React.Component {
  
  componentDidMount() {
    this.refs.audioPlayer.ondurationchange = () => {
      const duration = Math.round(this.refs.audioPlayer.duration)
      this.props.onDurationChange(duration)
    }
  }

  render() {
    return (
      <div className={`c-input c-input--audio${this.props.fill ? ' c-input--fill' : ''}`}>
        <FileInput
          placeholder={this.props.placeholder}
          value={this.props.value}
          fill={this.props.fill}
          onChange={this.props.onChange} />
          <audio ref='audioPlayer' src={this.props.url} controls />
          {this.props.upload.showProgress && <ProgressBar value={this.props.upload.progress} />}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    upload: state.app.upload
  }
}

const AudioInput = connect(
  mapStateToProps,
  null
)(AudioInputComponent)

export default AudioInput
