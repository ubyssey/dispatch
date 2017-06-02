import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import eventsActions from '../../actions/EventsActions'

import EventCard from './EventCard'

require('../../../styles/components/event_audit.scss')

const PENDING_QUERY = {
  pending: 1,
  limit: 15
}

class EventAuditPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      count: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.events.count != this.props.events.count) {
      this.setState({ count: nextProps.events.count })
    }

    if (nextProps.events.count && !this.eventCount
        && !this.reloadListFlag) {
      this.props.listEvents(this.props.token, PENDING_QUERY)
      this.reloadListFlag = true
    }
  }

  componentWillMount() {
    this.props.listEvents(this.props.token, PENDING_QUERY)

    if (this.props.events) {
      this.setState({ count: this.props.events.count })
    }
  }

  approve(id) {
    const event = this.props.entities.events[id]
    event.is_submission = 0
    this.props.saveEvent(this.props.token, id, event)
    this.setState({ count: this.state.count - 1 })
    this.reloadListFlag = false
  }

  disapprove(id) {
    this.props.deleteEvent(this.props.token, id)
    this.setState({ count: this.state.count - 1 })
    this.reloadListFlag = false
  }

  render() {
    this.eventCount = 0
    const events = this.props.events.ids.map((id, idx) => {
      const event = this.props.entities.events[id]

      if (!event.is_submission) {
        return null
      }
      this.eventCount++

      return (
        <EventCard
          key={id}
          event={event}
          approve={() => {this.approve(id, idx)}}
          disapprove={() => {this.disapprove(id, idx)}} />
      )
    })

    return (
      <DocumentTitle title='Audit Event'>
        <div className='u-container'>
          <h2 className='c-event-audit-title'>
            Event Auditing
          </h2>
          <div className='c-event-audit-subtitle'>
            {this.state.count} event{this.state.count == 1 ? '' : 's'} pending approval
          </div>
          <ReactCSSTransitionGroup
            transitionName="c-event-audit-card"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}>
            {events}
        </ReactCSSTransitionGroup>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.app.events.list,
    entities: {
      events: state.app.entities.events
    },
    token: state.app.auth.token
  }
}

function prepareData(data) {
  const ret = new FormData()

  ret.append('is_submission', data.is_submission)

  return ret
}

const mapDispatchToProps = (dispatch) => {
  return {
    listEvents: (token, query) => {
      dispatch(eventsActions.list(token, query))
    },
    saveEvent: (token, eventId, data) => {
      dispatch(eventsActions.save(token, eventId, prepareData(data)))
    },
    deleteEvent: (token, eventId, next) => {
      dispatch(eventsActions.deleteMany(token, [eventId], next))
    }
  }
}


const EventAudit = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventAuditPage)

export default EventAudit
