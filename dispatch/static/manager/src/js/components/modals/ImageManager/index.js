import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'

import { Button, Intent } from '@blueprintjs/core'
import { AuthorFilterInput, TagsFilterInput }  from '../../inputs/filters/'

import imagesActions from '../../../actions/ImagesActions'

import { SearchInput } from '../../inputs'
import ImageThumb from './ImageThumb'
import ImagePanel from './ImagePanel'

require('../../../../styles/components/image_manager.scss')

const SCROLL_THRESHOLD = 100

const DEFAULT_QUERY = {
  limit: 50,
  ordering: '-created_at'
}

class ImageManagerComponent extends React.Component {

  constructor(props) {
    super(props)

    this.scrollListener = this.scrollListener.bind(this)

    this.state = {
      uploadNoAuthorError: null,
      editNoAuthorError: null,
      uploadedImages: null,
      newImage: {'img': null, 'title': null, 'authors': [], 'tags': [] },
      author: '',
      tags: [],
      q: '',
      limit: DEFAULT_QUERY.limit,
    }
  }

  componentDidMount() {
    this.props.listImages(this.props.token, DEFAULT_QUERY)

    this.images.parentElement.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount() {
    this.images.parentElement.removeEventListener('scroll', this.scrollListener)
  }

  buildQuery() {
    let queryObj = {
      'q': this.state.q
    }
    if (this.state.author) {
      queryObj.author = this.state.author
    }
    if (this.state.tags) {
      queryObj.tags = this.state.tags
    }
    return Object.assign(queryObj, DEFAULT_QUERY)
  }

  loadMore() {
    if (this.props.images.count > this.state.limit) {
      this.setState(prevState => ({
        limit: prevState.limit + 25
      }), this.props.listImages(this.props.token, this.buildQuery()))
    }
  }

  searchImages() {
    this.props.listImages(this.props.token, this.buildQuery())
  }

  scrollListener() {
    const containerHeight = this.images.clientHeight
    const scrollOffset = this.images.parentElement.scrollTop + this.images.parentElement.clientHeight
    if (!this.props.images.isLoading && scrollOffset >= containerHeight - SCROLL_THRESHOLD) {
      this.loadMore()
    }
  }

  getImage() {
    return this.props.entities.local[this.props.image.id]
  }

  handleSave() {
    const image = this.getImage()
    if(!image.authors.length){
      this.setState({ editNoAuthorError: 'This field is required.' })
      return
    }
    this.props.saveImage(this.props.token, image.id, image)
  }

  handleDelete() {
    this.props.deleteImage(this.props.token, this.props.image.id)
  }

  handleUpdate(field, data) {
    this.props.setImage(
      R.assoc(field, data, this.getImage())
    )
    if(field == 'authors' && data.length) { this.setState({ editNoAuthorError: null }) }
  }

  insertImage() {
    if (this.props.many) {
      this.props.clearSelectedImages()
      this.props.onSubmit(this.props.images.selected)
    } else {
      this.props.onSubmit(this.getImage())
    }
  }

  onSearch(author, tags, q) {
    this.setState({
      author: author,
      tags: tags,
      q: q
    }, this.searchImages)
  }

  onDrop(images) {
    this.setNextImage(images)
  }

  setNextImage(images) {
    const [first, ...rest] = images
    this.setState({
      uploadNoAuthorError: null,
      uploadedImages: rest,
      newImage: {'img': first, 'title': null, 'authors': [], 'tags': [] }
    })
  }

  modalHandleSave() {
    var payload = { 'img': this.state.newImage.img }
    if(this.state.newImage.authors.length){
      payload['authors'] = JSON.stringify(this.state.newImage.authors)
    } 
    else { 
      this.setState({
        uploadNoAuthorError: 'This field is required.'
      })
      return 
    }
    if(this.state.newImage.title){
      payload['title'] = this.state.newImage.title
    }
    if(this.state.newImage.tags.length){
      payload['tags'] = this.state.newImage.tags
    }
    
    this.props.createImage(this.props.token, payload, () => {
      this.setNextImage(this.state.uploadedImages)
    })
  }

  modalHandleCancel() {
    this.setNextImage(this.state.uploadedImages)
  }

  modalHandleUpdate(field, data) {
    this.setState(state => ( state.newImage[field] = data, state ))
    if(field == 'authors' && data.length) { this.setState({ uploadNoAuthorError: null }) }
  }

  handleSelectImage(imageId) {
    this.props.selectImage(imageId)
    this.setState({ editNoAuthorError: null})
  }

  render() {
    const image = this.getImage()

    const images = this.props.images.ids.map(id => {
      const image = this.props.entities.remote[id]
      return (
        <ImageThumb
          key={image.id}
          image={image}
          isSelected={this.props.many ? R.contains(id, this.props.images.selected) : this.props.image.id === id}
          selectImage={this.props.many ? this.props.toggleImage : (imageId) => {this.handleSelectImage(imageId)}} />
      )
    })

    const editImagePanel = (
      <ImagePanel
        image={image}
        authorErrors={this.state.editNoAuthorError}
        update={(field, data) => this.handleUpdate(field, data)}
        save={() => this.handleSave()}
        delete={() => this.handleDelete()} />
    )

    const uploadImagePanel = (
      <ImagePanel 
        image={this.state.newImage}
        successBtnName={'Save'}
        dangerBtnName={'Cancel'}
        authorErrors={this.state.uploadNoAuthorError}
        update={(field, data) => this.modalHandleUpdate(field, data)}
        save={() => this.modalHandleSave()}
        delete={() => this.modalHandleCancel()} />
    )

    const filters = [
      <AuthorFilterInput
        key={'AuthorFilter'}
        value={this.state.author || ''}
        update={(author) => this.onSearch(author, this.state.tags, this.state.q)} />,
      <TagsFilterInput
        key={'tagsFilter'}
        value={this.state.tags || ''}
        update={(tags) => this.onSearch(this.state.author, tags, this.state.q)} />
    ]

    return (
      <div className='c-image-manager'>
        <div className='c-image-manager__header'>
          <div className='c-image-manager__header__left'>
            {filters}
          </div>
          <div className='c-image-manager__header__right'>
            <SearchInput
              placeholder='Search'
              value={this.state.q}
              onChange={e => this.onSearch(this.state.author, this.state.tags, e.target.value)} />
            <Button
              intent={Intent.SUCCESS}
              icon='upload'
              onClick={() => this.dropzone.open()}>Upload</Button>
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
              ref={(node) => { this.images = node }}>{images}
            </div>
            {this.props.images.isLoading && <h2 style={{position:'relative', top: '-8px', width:'100%', textAlign:'center'}}>Loading...</h2>}
          </Dropzone>
          {!this.props.many ?
            <div className='c-image-manager__active'>
              {image ? editImagePanel : null}
            </div> : null}
        </div>

          {this.state.newImage.img &&
            <div className='c-modal-container-scrollable'>
              <div className='c-modal-body'>
                {uploadImagePanel}
              </div>
            </div> 
          }

        <div className='c-image-manager__footer'>
          <div className='c-image-manger__footer__selected' />
          <Button
            intent={Intent.SUCCESS}
            disabled={this.props.many ? !this.props.images.selected.length : !this.props.image.id}
            onClick={() => this.insertImage()}>Insert</Button>
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
    createImage: (token, data, callback) => {
      dispatch(imagesActions.create(token, data, null, callback))
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