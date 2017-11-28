import React from 'react'
import { connect } from 'react-redux'

import galleriesActions from '../../actions/GalleriesActions'
import GalleryForm from './GalleryForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Gallery'
const AFTER_DELETE = 'galleries'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.galleries.single,
    entities: {
      remote: state.app.entities.galleries,
      local: state.app.entities.local.galleries,
    },
    token: state.app.auth.token
  }
}

function processData(data) {
  const images = data.images ?
    data.images.map(img => {
      return {
        image_id: img.image_id || img.image.id,
        caption: img.caption || '',
        credit: img.credit || ''
      }
    }) : {}

  return {
    title: data.title,
    attachment_json: images
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, galleryId) => {
      dispatch(galleriesActions.get(token, galleryId))
    },
    setListItem: (gallery) => {
      dispatch(galleriesActions.set(gallery))
    },
    saveListItem: (token, galleryId, data) => {
      dispatch(galleriesActions.save(token, galleryId, processData(data)))
    },
    createListItem: (token, data) => {
      dispatch(galleriesActions.create(token, processData(data), AFTER_DELETE))
    },
    deleteListItem: (token, galleryId, next) => {
      dispatch(galleriesActions.delete(token, galleryId, next))
    }
  }
}

function TopicEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      afterDelete={AFTER_DELETE}
      form={GalleryForm}
      displayField='title'
      {... props} />
  )
}

const TopicEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicEditorComponent)

export default TopicEditor
