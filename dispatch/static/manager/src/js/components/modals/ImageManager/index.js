import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import * as imagesActions from '../../../actions/ImagesActions'

import { Button, TextInput } from '../../inputs'
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

  handleSave() {
    const image = this.props.entities.image[this.props.image.data]
    this.props.saveImage(this.props.token, image.id, image)
  }

  handleDelete() {
    this.props.deleteImage(this.props.token, this.props.image.data)
  }

  handleUpdate(field, data) {
    const image = this.props.entities.image[this.props.image.data]

    this.props.updateImage(
      R.assoc(field, data, image)
    )
  }

  insertImage() {
    const image = this.props.entities.images[this.props.image.data]
    this.props.onSubmit(image)
  }

  renderImagePanel() {
    const image = this.props.entities.image[this.props.image.data]

    if (image) {
      return (
        <ImagePanel
          image={image}
          update={(field, data) => this.handleUpdate(field, data)}
          save={() => this.handleSave()}
          delete={() => this.handleDelete()} />
      )
    } else {
      return
    }
  }

  render() {

    const images = this.props.images.data.map( id => {
      let image = this.props.entities.images[id]
      return (
        <ImageThumb
          key={image.id}
          image={image}
          isSelected={this.props.image.data === id}
          selectImage={this.props.selectImage} />
      )
    })

    return (
      <div className='c-image-manager'>
        <div className='c-image-manager__header'>
          <div className='c-image-manager__header__left'>
            <Button>Upload</Button>
          </div>
          <div className='c-image-manager__header__right'>
            <TextInput placeholder='Search' />
          </div>
        </div>
        <div className='c-image-manager__body'>
          <div className='c-image-manager__images'>
            <div
              className='c-image-manager__images__container'
              ref={(elem) => { this.images = elem }}>{images}</div>
          </div>
          <div className='c-image-manager__active'>
          {this.renderImagePanel()}
          </div>
        </div>
        <div className='c-image-manager__footer'>
          <div className='c-image-manger__footer__selected'></div>
          <Button
            disabled={!this.props.image.data}
            onClick={() => this.insertImage()}>Insert</Button>
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
