import React from 'react'
import { connect } from 'react-redux'

import podcastsActions from '../../actions/PodcastsActions'
import PodcastForm from './PodcastForm'
import ItemEditor from '../ItemEditor'
import { LinkButton } from '../inputs'

const TYPE = 'Podcast'
const TYPE_PLURAL = 'Podcasts'
const AFTER_DELETE = 'podcasts'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.podcasts.single,
    entities: {
      remote: state.app.entities.podcasts,
      local: state.app.entities.local.podcasts,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, podcastId) => {
      dispatch(podcastsActions.get(token, podcastId))
    },
    setListItem: (podcast) => {
      dispatch(podcastsActions.set(podcast))
    },
    saveListItem: (token, podcastId, data) => {
      dispatch(podcastsActions.save(token, podcastId, data))
    },
    createListItem: (token, data) => {
      dispatch(podcastsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, podcastId, next) => {
      dispatch(podcastsActions.delete(token, podcastId, next))
    }
  }
}

function PodcastEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={PodcastForm}
      displayField='title'
      extraButton={
        <LinkButton
          minimal={true}
          icon='list'
          to={`/podcasts/${props.itemId}/episodes/`}>Episodes</LinkButton>
      }
      {... props} />
  )
}

const PodcastEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastEditorComponent)

export default PodcastEditor
