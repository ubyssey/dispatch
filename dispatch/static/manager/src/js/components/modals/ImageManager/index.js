import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

import { AnchorButton, Intent } from '@blueprintjs/core'

import imagesActions from '../../../actions/ImagesActions'

import { TextInput } from '../../inputs'
import ImageThumb from './ImageThumb'
import ImagePanel from './ImagePanel'

require('../../../../styles/components/image_manager.scss')

const SCROLL_THRESHOLD = 20

const DEFAULT_QUERY = {
  limit: 30,
  ordering: '-created_at'
}

class ImageManagerComponent extends React.Component {

  constructor(props) {
    super(props)

    this.scrollListener = this.scrollListener.bind(this)

    this.state = {
      q: ''
    }
  }

  componentDidMount() {
    this.props.listImages(this.props.token, DEFAULT_QUERY)

    this.images.parentElement.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount() {
    this.images.parentElement.removeEventListener('scroll', this.scrollListener)
  }

  loadMore() {
    this.props.listImagesPage(this.props.token, this.props.images.next)
  }

  searchImages() {
    this.props.listImages(this.props.token, R.assoc('q', this.state.q, DEFAULT_QUERY))
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
    return this.props.entities.local[this.props.image.id]
  }

  handleSave() {
    const image = this.getImage()
    this.props.saveImage(this.props.token, image.id, image)
  }

  handleDelete() {
    this.props.deleteImage(this.props.token, this.props.image.id)
  }

  handleUpdate(field, data) {
    this.props.setImage(
      R.assoc(field, data, this.getImage())
    )
  }

  insertImage() {
    if (this.props.many) {
      this.props.clearSelectedImages()
      this.props.onSubmit(this.props.images.selected)
    } else {
      this.props.onSubmit(this.getImage())
    }
  }

  onSearch(q) {
    this.setState({ q: q}, this.searchImages)
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

    const images = this.props.images.ids.map( id => {
      const image = this.props.entities.remote[id]
      return (
        <ImageThumb
          key={image.id}
          image={image}
          isSelected={this.props.many ? R.contains(id, this.props.images.selected) : this.props.image.id === id}
          selectImage={this.props.many ? this.props.toggleImage : this.props.selectImage} />
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
            <TextInput
              placeholder='Search'
              value={this.state.q}
              onChange={e => this.onSearch(e.target.value)} />
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
          {!this.props.many ?
          <div className='c-image-manager__active'>
            {image ? imagePanel : null}
          </div> : null}
        </div>
        <div className='c-image-manager__footer'>
          <div className='c-image-manger__footer__selected'></div>
          <AnchorButton
            disabled={this.props.many ? !this.props.images.selected.length : !this.props.image.id}
            onClick={() => this.insertImage()}>Insert</AnchorButton>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    images: state.app.images.list,
    image: state.app.images.single,
    entities: {
      remote: state.app.entities.images,
      local: state.app.entities.local.images
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listImages: (token, params) => {
      dispatch(imagesActions.list(token, params))
    },
    listImagesPage: (token, uri) => {
      dispatch(imagesActions.listPage(token, uri))
    },
    selectImage: (imageId) => {
      dispatch(imagesActions.select(imageId))
    },
    toggleImage: (imageId) => {
      dispatch(imagesActions.toggle(imageId))
    },
    clearSelectedImages: () => {
      dispatch(imagesActions.clearSelected())
    },
    setImage: (imageId, image) => {
      dispatch(imagesActions.set(imageId, image))
    },
    createImage: (token, data) => {
      dispatch(imagesActions.create(token, data))
    },
    saveImage: (token, imageId, image) => {
      dispatch(imagesActions.save(token, imageId, image))
    },
    deleteImage: (token, imageId) => {
      dispatch(imagesActions.delete(token, imageId))
    }
  }
}

const ImageManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageManagerComponent)

export default ImageManager
