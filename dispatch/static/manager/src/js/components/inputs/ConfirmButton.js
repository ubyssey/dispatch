import React from 'react'

import { Button, Alert, Intent } from '@blueprintjs/core'

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
      <Button
        className={this.props.className}
        intent={this.props.intent}
        icon={this.props.icon}
        disabled={this.props.disabled}
        onClick={() => this.setState({ alertOpen: true })}>
        {this.props.children}
        <Alert
          isOpen={this.state.alertOpen}
          cancelButtonText='Cancel'
          confirmButtonText={this.props.confirmButtonText}
          iconName='trash'
          onCancel={() => this.setState({ alertOpen: false })}
          onConfirm={() => this.onConfirm()}
          intent={Intent.DANGER}>
          <p>{this.props.message}</p>
        </Alert>
      </Button>
    )
  }
}

ConfirmButton.defaultProps = {
  message: 'Are you sure you want to delete this?',
  confirmButtonText: 'Delete'
}
