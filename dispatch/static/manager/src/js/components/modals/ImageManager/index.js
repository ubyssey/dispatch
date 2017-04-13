import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

import { AnchorButton, Intent } from '@blueprintjs/core'

import * as imagesActions from '../../../actions/ImagesActions'

import { TextInput } from '../../inputs'
import ImageThumb from './ImageThumb'
import ImagePanel from './ImagePanel'

require('../../../../styles/components/image_manager.scss')

const SCROLL_THRESHOLD = 20

class ImageManagerComponent extends React.Component {

  constructor(props) {
    super(props)

    this.scrollListener = this.scrollListener.bind(this)
  }

  componentDidMount() {
    this.props.fetchImages(this.props.token, { limit: 30, ordering: '-created_at' })

    this.images.parentElement.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount() {
    this.images.parentElement.removeEventListener('scroll', this.scrollListener)
  }

  loadMore() {
    this.props.fetchImagesPage(this.props.token, this.props.images.next)
  }

  scrollListener() {
    const containerHeight = this.images.clientHeight
    const scrollOffset = this.images.parentElement.scrollTop + this.images.parentElement.clientHeight

    if (!this.props.images.isLoading &&
        this.props.images.next &&
        scrollOffset >= containerHeight - SCROLL_THRESHOLD) {
      this.loadMore()
    }

  }

  getImage() {
    return this.props.entities.image[this.props.image.data]
  }

  handleSave() {
    const image = this.getImage()
    this.props.saveImage(this.props.token, image.id, image)
  }

  handleDelete() {
    this.props.deleteImage(this.props.token, this.props.image.data)
  }

  handleUpdate(field, data) {
    this.props.updateImage(
      R.assoc(field, data, this.getImage())
    )
  }

  insertImage() {
    this.props.onSubmit(this.getImage())
  }

  onDrop(files) {
    files.forEach(file => {
      let formData = new FormData()
      formData.append('img', file, file.name)
      this.props.createImage(this.props.token, formData)
    })
  }

  render() {

    const image = this.getImage()

    const images = this.props.images.data.map( id => {
      const image = this.props.entities.images[id]
      return (
        <ImageThumb
          key={image.id}
          image={image}
          isSelected={this.props.image.data === id}
          selectImage={this.props.selectImage} />
      )
    })

    const imagePanel = (
      <ImagePanel
        image={image}
        update={(field, data) => this.handleUpdate(field, data)}
        save={() => this.handleSave()}
        delete={() => this.handleDelete()} />
    )

    return (
      <div className='c-image-manager'>
        <div className='c-image-manager__header'>
          <div className='c-image-manager__header__left'>
            <AnchorButton
              intent={Intent.SUCCESS}
              onClick={() => this.dropzone.open()}>Upload</AnchorButton>
          </div>
          <div className='c-image-manager__header__right'>
            <TextInput placeholder='Search' />
          </div>
        </div>
        <div className='c-image-manager__body'>
          <Dropzone
            ref={(node) => { this.dropzone = node }}
            className='c-image-manager__images'
            onDrop={(files) => this.onDrop(files)}
            disableClick={true}
            activeClassName='c-image-manager__images--active'>
            <div
              className='c-image-manager__images__container'
              ref={(node) => { this.images = node }}>{images}</div>
          </Dropzone>
          <div className='c-image-manager__active'>
            {image ? imagePanel : null}
          </div>
        </div>
        <div className='c-image-manager__footer'>
          <div className='c-image-manger__footer__selected'></div>
          <AnchorButton
            disabled={!this.props.image.data}
            onClick={() => this.insertImage()}>Insert</AnchorButton>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    images: state.app.images.images,
    image: state.app.images.image,
    entities: {
      images: state.app.entities.images,
      image: state.app.entities.image
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchImages: (token, params) => {
      dispatch(imagesActions.fetchImages(token, params))
    },
    fetchImagesPage: (token, uri) => {
      dispatch(imagesActions.fetchImagesPage(token, uri))
    },
    selectImage: (imageId) => {
      dispatch(imagesActions.selectImage(imageId))
    },
    updateImage: (imageId, image) => {
      dispatch(imagesActions.updateImage(imageId, image))
    },
    createImage: (token, data) => {
      dispatch(imagesActions.createImage(token, data))
    },
    saveImage: (token, imageId, image) => {
      dispatch(imagesActions.saveImage(token, imageId, image))
    },
    deleteImage: (token, imageId) => {
      dispatch(imagesActions.deleteImage(token, imageId))
    }
  }
}

const ImageManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageManagerComponent)

export default ImageManager
