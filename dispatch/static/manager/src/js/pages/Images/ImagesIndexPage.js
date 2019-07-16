import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Dropzone from 'react-dropzone'
import { Button } from '@blueprintjs/core'

import R from 'ramda'
import { Link } from 'react-router'

import imageActions from '../../actions/ImagesActions'
import ItemList from '../../components/ItemList'
import { humanizeDatetime } from  '../../util/helpers'
import { AuthorFilterInput, TagsFilterInput} from '../../components/inputs/filters'
import ImagePanel from '../../components/modals/ImageManager/ImagePanel'

require('../../../styles/components/files.scss')
require('../../../styles/components/images.scss')

const DEFAULT_LIMIT = 15

class ImagesPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      noAuthorError: null,
      uploadedImages: null,
      newImage: {'img': null, 'title': null, 'authors': [], 'tags': [] }
    }
  }

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

    if (this.props.location.query.author) {
      query.author = this.props.location.query.author
    }
    if (this.props.location.query.tags) {
      query.tags = this.props.location.query.tags
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
    return prevProps.location.query !== props.location.query
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
    let author = this.props.location.query.author
    let tags = this.props.location.query.tags
    this.props.searchImages(author, tags, query)
  }

  onDrop(images) {
    this.setNextImage(images)
  }

  onDropzoneClick() {
    this.dropzone.open()
  }

  renderThumb(url) {
    return (
      <div className={'c-image-page-thumb'} style={{backgroundImage: 'url(' + url + ')'}} />
    )
  }

  setNextImage(images) {
    const [first, ...rest] = images
    this.setState({
      noAuthorError: null,
      uploadedImages: rest,
      newImage: {'img': first, 'title': null, 'authors': [], 'tags': [] }
    })
  }

  modalHandleSave() {
    var payload = { 'img': this.state.newImage.img }
    if(this.state.newImage.authors.length > 0){
      payload['authors'] = JSON.stringify(this.state.newImage.authors)
    } 
    else { 
      this.setState({
        noAuthorError: 'This field is required.'
      })
      return 
    }
    if(this.state.newImage.title){
      payload['title'] = this.state.newImage.title
    }
    if(this.state.newImage.tags.length){
      payload['tags'] = this.state.newImage.tags
    }
    
    this.props.createImage(this.props.token, payload)
    this.setNextImage(this.state.uploadedImages)
  }

  modalHandleCancel() {
    this.setNextImage(this.state.uploadedImages)
  }

  modalHandleUpdate(field, data) {
    this.setState(state => ( state.newImage[field] = data, state ))
    if(field == 'authors' && data.length) { this.setState({ noAuthorError: null }) }
  }

  render() {

    // The first column will always be a link, as defined here,
    // containing the item property associated with displayColumn
    const columns = R.insert(0, item => (
      <strong>
        <Link
          to={`/images/${item.id}`}
          dangerouslySetInnerHTML={{__html: item[this.props.displayColumn] || item.filename}} />
      </strong>
    // extraColumns are after the main link column
    ),[
      item => (item.title),
      item => (this.renderThumb(item.url_thumb)),
      item => (item.authors.length ? this.props.entities.persons[item.authors[0].person]['full_name']: ''),
      item => (String(item.width) + 'x' + String(item.height)),
      item => humanizeDatetime(item.created_at, true),
      item => humanizeDatetime(item.updated_at, true)
    ])

    const filters = [
      <AuthorFilterInput
        key={'authorFilter'}
        value={this.props.location.query.author}
        update={(author) => this.props.searchImages(author, this.props.location.query.tags, this.props.location.query.q)} />,
      <TagsFilterInput
        key={'tagsFilter'}
        value={this.props.location.query.tags}
        update={(tags) => this.props.searchImages(this.props.location.query.author, tags, this.props.location.query.q)} />
    ]

    const uploadImagePanel = (
      <ImagePanel 
        image={this.state.newImage}
        successBtnName={'Save'}
        dangerBtnName={'Cancel'}
        authorErrors={this.state.noAuthorError}
        update={(field, data) => this.modalHandleUpdate(field, data)}
        save={() => this.modalHandleSave()}
        delete={() => this.modalHandleCancel()} />
    )

    return (
      <DocumentTitle title='Images'>
        <Dropzone
          ref={(node) => { this.dropzone = node }}
          className='c-files-dropzone'
          onDrop={(images) => this.onDrop(images)}
          disableClick={true}
          activeClassName='c-files-dropzone--active'>

          <div className='c-files-dropzone__list'>
            <ItemList
              location={this.props.location}

              typeSingular='image'
              typePlural='images'

              currentPage={this.getCurrentPage()}
              totalPages={this.getTotalPages()}

              items={this.props.images}
              entities={this.props.entities.images}

              headers={['Image filename', 'Title', 'Preview', 'Author', 'Size', 'Created', 'Updated']}
              columns={columns}

              filters={filters}

              emptyMessage={'You haven\'t uploaded any images yet.'}
              createHandler={() => (<Button onClick={() => this.onDropzoneClick()}>Upload</Button>)}

              actions={{
                toggleItem: this.props.toggleImage,
                toggleAllItems: this.props.toggleAllImages,
                deleteItems: (imageIds) => this.handleDeleteImages(imageIds),
                searchItems: (query) => this.handleSearchImages(query)
              }} />
          </div>
          
          {this.state.newImage.img &&
          <div className='c-modal-container-scrollable'>
            <div className='c-modal-body'>
              {uploadImagePanel}
            </div>
          </div> 
          }
          
          <div className='c-files-dropzone__text' onClick={() => this.onDropzoneClick()}>
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
    entities: {
      images: state.app.entities.images,
      persons: state.app.entities.persons,
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
    searchImages: (author, tags, query) => {
      dispatch(imageActions.search(author, tags, query))
    }
  }
}

const ImagesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImagesPageComponent)

export default ImagesPage
