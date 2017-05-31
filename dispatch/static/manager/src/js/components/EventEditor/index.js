import React from 'react'
import { connect } from 'react-redux'

import { dateObjToAPIString } from '../../util/helpers'

import eventsActions from '../../actions/EventsActions'
import EventForm from './EventForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Event'
const AFTER_DELETE = 'events'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.events.single,
    entities: {
      remote: state.app.entities.events,
      local: state.app.entities.local.events,
    },
    token: state.app.auth.token
  }
}

const processData = (data) => {
  return {
    title: data.title,
    description: data.description,
    host: data.host,
    image: typeof data.image === 'object' ? data.image.id : data.image,
    start_time: data.start_time ? dateObjToAPIString(data.start_time) : null,
    end_time: data.end_time ? dateObjToAPIString(data.end_time) : null,
    location: data.location,
    address: data.address,
    category: data.category,
    facebook_url: data.facebook_url
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, eventId) => {
      dispatch(eventsActions.get(token, eventId))
    },
    setListItem: (event) => {
      dispatch(eventsActions.set(event))
    },
    saveListItem: (token, eventId, data) => {
      dispatch(eventsActions.save(token, eventId, processData(data)))
    },
    createListItem: (token, data) => {
      dispatch(eventsActions.create(token, processData(data), AFTER_DELETE))
    },
    deleteListItem: (token, eventId, next) => {
      dispatch(eventsActions.delete(token, eventId, next))
    }
  }
}

function EventEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      afterDelete={AFTER_DELETE}
      form={EventForm}
      {... props} />
  )
}

const EventEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventEditorComponent)

export default EventEditor
