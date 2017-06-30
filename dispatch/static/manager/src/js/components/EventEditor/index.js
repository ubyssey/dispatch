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

const processData = (data) => {
  let formData = new FormData()

  formData.append('title', data.title || '')
  formData.append('description', data.description || '')
  formData.append('host', data.host || '')
  if (data.image instanceof File) {
    formData.append('image', data.image, data.image.name)
  }
  formData.append('start_time', data.start_time ? dateObjToAPIString(data.start_time) : '')
  formData.append('end_time', data.end_time ? dateObjToAPIString(data.end_time) : '')
  formData.append('location', data.location || '')
  formData.append('address', data.address || '')
  formData.append('category', data.category || '')
  formData.append('facebook_url', data.facebook_url || '')
  formData.append('submitter_email', data.submitter_email || '')
  formData.append('submitter_phone', data.submitter_phone || '')

  return formData
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
    },
    publishEvent(token, id) {
      const form = new FormData()
      form.append('is_published', true)
      dispatch(eventsActions.save(token, id, form))
    },
    unpublishEvent(token, id) {
      const form = new FormData()
      form.append('is_published', false)
      dispatch(eventsActions.save(token, id, form))
    }
  }
}

function EventEditorComponent(props) {

  const publishButton = (
    <AnchorButton onClick={() => props.publishEvent(props.token, props.listItem.id)}
      intent={Intent.PRIMARY}
      disabled={props.isNew} >
      <span className='pt-icon-standard pt-icon-th'></span>
      Publish
    </AnchorButton>
  )

  const unpublishButton = (
    <AnchorButton onClick={() => props.unpublishEvent(props.token, props.listItem.id)}
      intent={Intent.PRIMARY}
      disabled={props.isNew} >
      <span className='pt-icon-standard pt-icon-th'></span>
      Unpublish
    </AnchorButton>
  )

  // const isPublished = props.entities.local && props.listItem.id
  // ? props.entities.local[props.listItem.id].is_published : false // default if not rendered to 'false', i.e. not published

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
