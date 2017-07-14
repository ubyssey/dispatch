import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import eventsActions from '../../actions/EventsActions'

class EventSelectInputComponent extends React.Component {

  listEvents(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listEvents(this.props.token, queryObj)
  }

  componentDidMount() {
    this.props.onChange(this.getSelected())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected != this.props.selected) {
      const selected = this.getSelected()
      if ((this.props.many && this.props.selected.length && R.difference(selected, this.props.selected).length)
        || (!this.props.many && selected != this.props.selected)) {
        this.props.onChange(selected)
      }
    }
  }

  getSelected() {
    if (this.props.selected) {
      return this.props.many ? this.props.selected.map(item => item.id || item) : this.props.selected.id || this.props.selected
    }
    return null
  }

  render() {
    const label = this.props.many ? 'events' : 'event'

    return (
      <ItemSelectInput
        many={this.props.many}
        selected={this.getSelected()}
        results={this.props.events.ids}
        entities={this.props.entities.events}
        onChange={(selected) => this.props.onChange(selected)}
        fetchResults={(query) => this.listEvents(query)}
        attribute='title'
        editMessage={this.props.selected ? `Edit ${label}` : `Add ${label}`} />
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
    }
  }
}

const EventSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventSelectInputComponent)

export default EventSelectInput
