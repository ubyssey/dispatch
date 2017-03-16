import React from 'react'

import { Popover, Position } from '@blueprintjs/core'

export default class Dropdown extends React.Component {

  constructor(props) {
    super(props)

    this.pageClick = this.pageClick.bind(this)

    this.mouseIsDownOnField = false

    this.state = {
      isOpen: false,
    }
  }

  // Public methods
  open() {
    this.setState({ isOpen: true })
  }

  close() {
    this.setState({ isOpen: false})
  }

  // Private methods
  componentDidMount() {
    // Add page click event listener
    window.addEventListener('mousedown', this.pageClick, false)
  }

  componentWillUnmount() {
    // Remove page click event listener
    window.removeEventListener('mousedown', this.pageClick)
  }

  pageClick() {
    this.setState({ isOpen: this.mouseIsDownOnField })
  }

  handleMouseDown() {
    this.mouseIsDownOnField = true
  }

  handleMouseUp() {
    this.mouseIsDownOnField = false
  }

  renderContent() {
    return (
      <div
        onMouseDown={() => this.handleMouseDown()}
        onMouseUp={() => this.handleMouseUp()}>
        {this.props.content}
      </div>
    )
  }

  render() {
    return (
      <Popover
        content={this.renderContent()}
        isOpen={this.state.isOpen}
        position={Position.BOTTOM_LEFT}
        inline={this.props.inline || false}>
        {this.props.children}
      </Popover>
    )
  }

}
