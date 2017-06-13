import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import eventsActions from '../../actions/EventsActions'

require('../../../styles/components/event_audit.scss')

class PendingTagComponent extends React.Component {

  componentWillMount() {
    this.props.countPending(this.props.token, { pending: 1, limit: 0 })
  }

  render() {
    if (!this.props.pending) {
      return null
    }

    return (
      <div className='c-event-list-pending-count'>
        <Link to='/events/audit'>
          <div className="pt-tag pt-large pt-intent-warning">
            {this.props.pending} pending events
          </div>
        </Link>
      </div>
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

const PendingTag = connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingTagComponent)

export default PendingTag
