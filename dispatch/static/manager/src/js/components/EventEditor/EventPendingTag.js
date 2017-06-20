import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import eventsActions from '../../actions/EventsActions'

require('../../../styles/components/event_audit.scss')

class EventPendingTagComponent extends React.Component {

  componentWillMount() {
    this.props.countPending(this.props.token, { pending: 1, limit: 0 })
  }

  render() {
    if (!this.props.pending) {
      return null
    }

    return (
      <Link to='/events/audit'>
        <div className='pt-tag pt-large pt-intent-warning'>
          {this.props.pending} pending events
        </div>
      </Link>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    pending: state.app.events.pending
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    countPending: (token) => {
      dispatch(eventsActions.countPending(token))
    }
  }
}

const EventPendingTag = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventPendingTagComponent)

export default EventPendingTag
