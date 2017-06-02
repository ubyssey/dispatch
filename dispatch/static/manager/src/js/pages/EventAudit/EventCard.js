import React from 'react'

import { AnchorButton, Tooltip } from '@blueprintjs/core'
import { LinkButton } from '../../components/inputs'
import { humanizeDatetime } from '../../util/helpers'

function labelAndProp(label, prop) {
  return (
    <div className='c-event-audit-card-label'>
      <div className='c-event-audit-card-label-label'>{label}</div>
        <div className='c-event-audit-card-label-prop'>{prop}</div>
    </div>
  )
}

export default class EventCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      right: false,
      left: false
    }
  }

  render() {
    let cardName = 'pt-card pt-elevation-2 c-event-audit-card'
    if (this.state.right) {
      cardName += ' c-event-audit-card-slideout-right'
    } else if (this.state.left) {
      cardName += ' c-event-audit-card-slideout-left'
    }

    return (
      <div className={cardName}>
        <div className='c-event-audit-card-title'>
          {this.props.event.title}
        </div>

        <div className='c-event-audit-card-nottitle'>
          {labelAndProp('Description', this.props.event.description)}
          {labelAndProp('Host', this.props.event.host)}
          {labelAndProp('Start', humanizeDatetime(this.props.event.start_time))}
          {labelAndProp('End', humanizeDatetime(this.props.event.end_time))}
          {labelAndProp('Location', this.props.event.location)}
          {labelAndProp('Address', this.props.event.address)}
          {labelAndProp('Category', this.props.event.category)}
          {labelAndProp('FB Link', this.props.event.facebook_url)}
        </div>

        <div className='c-event-audit-card-image-cont'>
          <img
            className='c-event-audit-card-image'
            src={this.props.event.image} />
        </div>

        <div className='c-event-audit-card-button-border' />
        <div className='c-event-audit-card-button-row'>

          <Tooltip
            className='c-event-audit-card-button-right'
            transitionDuration={15}
            content="Delete">
            <AnchorButton
              onClick={() => {
                this.setState({ left: true })
                this.props.disapprove()
              }}>
              Disapprove
            </AnchorButton>
          </Tooltip>

          <AnchorButton
            onClick={() => {
              this.setState({ right: true })
              this.props.approve()
            }}>
            Approve
          </AnchorButton>

          <LinkButton
            className='c-event-audit-card-button-edit'
            to={`/events/${this.props.event.id}`}>
            Edit
          </LinkButton>

        </div>
      </div>
    )
  }
}
