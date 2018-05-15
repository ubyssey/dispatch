import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Dropzone from 'react-dropzone'
import { Button } from '@blueprintjs/core'

import imageActions from '../actions/ImagesActions'
import ItemList from '../components/ItemList'
import { humanizeDatetime } from  '../util/helpers'
// import ImageThumb from '../components/modals/ImageManager/ImageThumb.js'

require('../../styles/components/files.scss')
require('../../styles/components/images.scss')

const DEFAULT_LIMIT = 15

class ImagesPageComponent extends React.Component {

  componentWillMount() {
    this.props.clearAllImages()
    this.props.clearSelectedImages()
    this.props.listImages(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {
    if (this.isNewQuery(prevProps, this.props)) {
      this.props.clearAllImages()
      this.props.clearSelectedImages()
      this.props.listImages(this.props.token, this.getQuery())
    }
    else if (this.isNewPage(prevProps, this.props)) {
      this.props.listImages(this.props.token, this.getQuery())
      this.props.clearSelectedImages()
    }
  }

  getQuery() {

    var query = {
      limit: DEFAULT_LIMIT,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }

    if (this.props.location.query.q) {
      query.q = this.props.location.query.q
    }

    return query
  }

  getCurrentPage() {
    return parseInt(this.props.location.query.page, 10) || 1
  }

  getTotalPages() {
    return Math.ceil(
      parseInt(this.props.images.count, 10) / DEFAULT_LIMIT
    )
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  isNewPage(prevProps, props) {
    // Returns true if the page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  handleDeleteImages(imageIds) {
    this.props.deleteImages(this.props.token, imageIds)
    this.props.clearSelectedImages()
  }

  handleSearchImages(query) {
    this.props.searchImages(this.props.token, query)
  }

  onDrop(images) {
    images.forEach(image => {
      let formData = new FormData()
      formData.append('img', image, image.name)
      // formData.append('name', image.name)
      this.props.createImage(this.props.token, formData)
    })
  }

  onDropzoneClick() {
    this.dropzone.open()
  }

  renderThumb(url) {
    return(
      <div className={'c-image-page-thumb'} style={{backgroundImage: 'url(' + url + ')'}}>

      </div>
    )
  }

  render() {
    return (
      <DocumentTitle title='Images'>
        <Dropzone
          ref={(node) => { this.dropzone = node }}
          className='c-images-dropzone'
          onDrop={(images) => this.onDrop(images)}
          disableClick={true}
          activeClassName='c-images-dropzone--active'>

          <div className='c-images-dropzone__list'>
            <ItemList
              location={this.props.location}

              typeSingular='image'
              typePlural='images'

              currentPage={this.getCurrentPage()}
              totalPages={this.getTotalPages()}

              items={this.props.images}
              entities={this.props.entities.images}

              headers={['Imagename', 'Preview', 'Title', 'Size', 'Created', 'Updated']}
              columns={[
                item => (<a href={item.url} target='_blank'>{item.filename}</a>),
                item => (this.renderThumb(item.url_thumb)),
                item => (item.title),
                item => (String(item.width) + 'x' + String(item.height)),
                item => humanizeDatetime(item.created_at),
                item => humanizeDatetime(item.updated_at),
              ]}

              emptyMessage={'You haven\'t uploaded any images yet.'}
              createHandler={() => (<Button onClick={() => this.onDropzoneClick()}>Upload</Button>)}

              actions={{
                toggleItem: this.props.toggleImage,
                toggleAllItems: this.props.toggleAllImages,
                deleteItems: (imageIds) => this.handleDeleteImages(imageIds),
                searchItems: (query) => this.handleSearchImages(query)
              }}
            />
          </div>
          <div className='c-images-dropzone__text' onClick={() => this.onDropzoneClick()}>
            <p>Drag images into window or click here to upload</p>
          </div>
        </Dropzone>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    images: state.app.images.list,
    // image: state.app.images.single,
    entities: {
      images: state.app.entities.images
    }
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    listImages: (token, query) => {
      dispatch(imageActions.list(token,query))
    },
    toggleImage: (imageId) => {
      dispatch(imageActions.toggle(imageId))
    },
    createImage: (token, image) => {
      dispatch(imageActions.create(token, image))
    },
    toggleAllImages: (imageIds) => {
      dispatch(imageActions.toggleAll(imageIds))
    },
    clearSelectedImages: () => {
      dispatch(imageActions.clearSelected())
    },
    clearAllImages: () => {
      dispatch(imageActions.clearAll())
    },
    deleteImages: (token, imageIds) => {
      dispatch(imageActions.deleteMany(token, imageIds))
    },
    searchImages: (token, query) => {
      dispatch(imageActions.search(query))
    }
  }
}

const ImagesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagesPageComponent)

export default ImagesPage
