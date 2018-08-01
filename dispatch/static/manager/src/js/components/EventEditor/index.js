import React from 'react'
import { connect } from 'react-redux'

import { AnchorButton, Intent } from '@blueprintjs/core'

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

function prepareData(formData){
  let data = formData
  data.start_time = formData.start_time ? dateObjToAPIString(formData.start_time) : ''
  data.end_time = formData.end_time ? dateObjToAPIString(formData.end_time) : ''
  return data
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
      dispatch(eventsActions.save(token, eventId, prepareData(data)))
    },
    createListItem: (token, data) => {
      dispatch(eventsActions.create(token, prepareData(data), AFTER_DELETE))
    },
    deleteListItem: (token, eventId, next) => {
      dispatch(eventsActions.delete(token, eventId, next))
    },
    publishEvent(token, id) {
      const data = {
        'is_published': true
      }
      dispatch(eventsActions.save(token, id, data))
    },
    unpublishEvent(token, id) {
      const data = {
        'is_published': false
      }
      dispatch(eventsActions.save(token, id, data))
    }
  }
}

function EventEditorComponent(props) {

  const publishButton = (
    <AnchorButton
      onClick={() => props.publishEvent(props.token, props.listItem.id)}
      intent={Intent.PRIMARY}
      disabled={props.isNew} >
      <span className='pt-icon-standard pt-icon-th' />
      Publish
    </AnchorButton>
  )

  const unpublishButton = (
    <AnchorButton
      onClick={() => props.unpublishEvent(props.token, props.listItem.id)}
      intent={Intent.PRIMARY}
      disabled={props.isNew} >
      <span className='pt-icon-standard pt-icon-th' />
      Unpublish
    </AnchorButton>
  )

  return (
    <ItemEditor
      type={TYPE}
      afterDelete={AFTER_DELETE}
      form={EventForm}
      displayField='title'
      extraButton={isPublished(props) ? unpublishButton : publishButton}
      {... props} />
  )
}

const isPublished = (obj) => {
  return obj.entities.local && obj.listItem.id
    ? obj.entities.local[obj.listItem.id].is_published : false
}

const EventEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventEditorComponent)

export default EventEditor
