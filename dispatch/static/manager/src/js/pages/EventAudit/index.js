import React from 'react'
import { connect } from 'react-redux'

import eventsActions from '../../actions/EventsActions'

import EventCard from './EventCard'

require('../../../styles/components/event_audit.scss')

// const PENDING_QUERY = {
//   pending: 1,
//   limit: 15
// }

const PENDING_QUERY = null

class EventAuditPage extends React.Component {
  componentWillMount() {
    console.log('hi')
    this.props.listEvents(this.props.token, PENDING_QUERY)
  }

  // should add some custom actions/reducers that will
  // remove the approved/disapproved event from the
  // list of ids
  approve(id) {
    const event = this.props.entities.events[id]
    event.pending = 0
    event.is_submission = 1
    this.props.saveEvent(this.props.token, id, event)
  }

  disapprove(id) {
    this.props.deleteEvent(this.props.token, id)
  }

  render() {
    const events = this.props.events.ids.map(id => {
      const event = this.props.entities.events[id]
      return (
        <EventCard
          key={id}
          event={event}
          approve={() => {this.approve(id)}}
          disapprove={() => {this.disapprove(id)}}
        />
      )
    })

    return (
      <div className='u-container'>
        <h2 className='c-event-audit-title'>
          Event Auditing
        </h2>
        {events}
      </div>
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

const mapDispatchToProps = (dispatch) => {
  return {
    listEvents: (token, query) => {
      dispatch(eventsActions.list(token, query))
    },
    saveEvent: (token, eventId, data) => {
      dispatch(eventsActions.save(token, eventId, data))
    },
    deleteEvent: (token, eventId, next) => {
      dispatch(eventsActions.delete(token, eventId, next))
    }
  }
}


const EventAudit = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventAuditPage)

export default EventAudit
