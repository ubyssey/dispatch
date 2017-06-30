import React from 'react'

import { AnchorButton, Alert, Intent } from '@blueprintjs/core'

export default class ConfirmButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      alertOpen: false
    }
  }

  onConfirm() {
    this.setState({alertOpen: false}, () => {
      this.props.onConfirm()
    })
  }

  render() {
    return (
      <div className='c-input--confirm'>
        <AnchorButton
          className={this.props.className}
          intent={this.props.intent}
          disabled={this.props.disabled}
          onClick={() => this.setState({ alertOpen: true })}>
          {this.props.children}
        </AnchorButton>
        <Alert
          isOpen={this.state.alertOpen}
          cancelButtonText='Cancel'
          confirmButtonText='Delete'
          iconName='trash'
          onCancel={() => this.setState({ alertOpen: false })}
          onConfirm={() => this.onConfirm()}
          intent={Intent.DANGER}>
          <p>{this.props.message}</p>
        </Alert>
      </div>
    )
  }
}

ConfirmButton.defaultProps = {
  message: 'Are you sure you want to delete this?'
}
