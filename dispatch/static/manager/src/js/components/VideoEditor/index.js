import React from 'react'
import { connect } from 'react-redux'

import videosActions from '../../actions/VideosActions'
import VideoForm from './VideoForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Video'
const TYPE_PLURAL = 'Videos'
const AFTER_DELETE = 'videos'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.videos.single,
    entities: {
      remote: state.app.entities.videos,
      local: state.app.entities.local.videos,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, videoId) => {
      dispatch(videosActions.get(token, videoId))
    },
    setListItem: (video) => {
      dispatch(videosActions.set(video))
    },
    saveListItem: (token, videoId, video) => {
      dispatch(videosActions.save(token, videoId, video))
    },
    createListItem: (token, video) => {
      dispatch(videosActions.create(token, video, AFTER_DELETE))
    },
    deleteListItem: (token, videoId, next) => {
      dispatch(videosActions.delete(token, videoId, next))
    }
  }
}

function VideoEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={VideoForm}
      displayField='title'
      {... props} />
  )
}

const VideoEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoEditorComponent)

export default VideoEditor
