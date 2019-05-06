import React from 'react'
import { connect } from 'react-redux'

import imagesActions from '../../actions/ImagesActions'
import ImageForm from './ImageForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Image'
const AFTER_DELETE = 'images'


const mapStateToProps = (state) => {
  return {
    listItem: state.app.images.single,
    entities: {
      remote: state.app.entities.images,
      local: state.app.entities.local.images,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, imageId) => {
      dispatch(imagesActions.get(token, imageId))
    },
    setListItem: (imageId, image) => {
      dispatch(imagesActions.set(imageId, image))
    },
    saveListItem: (token, imageId, image) => {
      dispatch(imagesActions.save(token, imageId, image))
    },
    createListItem: (token, image) => {
      dispatch(imagesActions.create(token, image))
    },
    deleteListItem: (token, imageId) => {
      dispatch(imagesActions.delete(token, imageId))
    }
  }
}

function ImageEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      afterDelete={AFTER_DELETE}
      form={ImageForm}
      displayField='full_name'
      {... props} />
  )
}

const ImageEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageEditorComponent)

export default ImageEditor
