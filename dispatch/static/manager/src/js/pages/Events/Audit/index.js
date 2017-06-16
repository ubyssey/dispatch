import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { replace } from 'react-router-redux'

import eventsActions from '../../../actions/EventsActions'

import EventCard from './EventCard'
import EventAuditPagination from './EventAuditPagination'

require('../../../../styles/components/event_audit.scss')

const PER_PAGE = 3

const PENDING_QUERY = {
  pending: 1,
  limit: PER_PAGE
}

class EventAuditPage extends React.Component {

  getQuery(props) {
    props = props || this.props

    const query = R.clone(PENDING_QUERY)

    if (props.location.query.page) {
      query.offset = (parseInt(props.location.query.page, 10) - 1) * PER_PAGE
    }

    return query
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.query.page != this.props.location.query.page){
      this.props.listEvents(this.props.token, this.getQuery())
    }
    if (this.getDisplayedCount(prevProps) > this.getDisplayedCount()) {
      this.props.listEvents(this.props.token, this.getQuery())
    }
  }

  componentWillMount() {
    this.props.listEvents(this.props.token, this.getQuery())
  }

  getDisplayedCount(props) {
    props = props || this.props
    return props.events.ids
       .map(id => props.entities.events[id])
       .filter(event => event && event.is_submission).length
  }

  checkPage() {
    if (this.getDisplayedCount(this.props) == 1 && this.props.location.query.page > 1) {
      let query = R.clone(this.props.location.query)

      query.page--

      this.props.replace({
        pathname: this.props.location.pathname,
        query: query
      })
      return true
    }
    return false
  }

  approve(id) {
    this.checkPage()
    this.props.approveEvent(this.props.token, id)
  }

  disapprove(id) {
    this.checkPage()
    this.props.disapproveEvent(this.props.token, id)
  }

  render() {
    const events = this.props.events.ids
      .map(id => this.props.entities.events[id])
      .map(event => {

        if (!event.is_submission) {
          return null
        }

        return (
          <EventCard
            key={event.id}
            event={event}
            approve={() => this.approve(event.id)}
            disapprove={() => this.disapprove(event.id)} />
        )
      })


    return (
      <DocumentTitle title='Audit Event'>
        <div className='u-container'>
          <h2 className='c-event-audit-title'>
            Event Auditing
          </h2>
          <div className='c-event-audit-subtitle'>
            {this.props.events.count > PER_PAGE ?
              <EventAuditPagination
                page={parseInt(this.props.location.query.page || 1, 10)}
                pages={Math.ceil(this.props.events.count / PER_PAGE)}
                location={this.props.location} /> : null}
            {this.props.events.count} event{this.props.events.count == 1 ? '' : 's'} pending approval
          </div>
          {events}
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

const mapDispatchToProps = (dispatch) => {
  return {
    listEvents: (token, query) => {
      dispatch(eventsActions.list(token, query))
    },
    approveEvent: (token, eventId) => {
      const form = new FormData()
      form.append('is_submission', false)
      dispatch(eventsActions.save(token, eventId, form))
    },
    disapproveEvent: (token, eventId, next) => {
      dispatch(eventsActions.deleteMany(token, [eventId], next))
    },
    replace: (path) => {
      dispatch(replace(path))
    }
  }
}


const EventAudit = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventAuditPage)

export default EventAudit
