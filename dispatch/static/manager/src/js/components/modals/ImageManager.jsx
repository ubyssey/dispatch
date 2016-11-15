import React from 'react'
import { connect } from 'react-redux'

import * as imagesActions from '../../actions/ImagesActions'
import * as personsActions from '../../actions/PersonsActions'

import { Button, TextInput } from '../inputs'
import ImageThumb from './ImageThumb.jsx'
import ImagePanel from './ImagePanel.jsx'

class ImageManagerComponent extends React.Component {

  constructor(props) {
    super(props)

    this.updateImage = this.updateImage.bind(this)
    this.saveImage = this.saveImage.bind(this)
    this.addAuthor = this.addAuthor.bind(this)
    this.removeAuthor = this.removeAuthor.bind(this)
    this.createAuthor = this.createAuthor.bind(this)

    this.fetchPersons = this.fetchPersons.bind(this)
    this.insertImage = this.insertImage.bind(this)
  }

  componentDidMount() {
    this.props.fetchImages({ordering: '-created_at'})
  }

  saveImage(image) {
    this.props.saveImage(this.props.token, image.id, image)
  }

  updateImage(image) {
    this.props.updateImage(image.id, image)
  }

  addAuthor(image, id) {
    return this.props.addAuthorToImage(this.props.token, image, id)
  }

  removeAuthor(image, id) {
    return this.props.removeAuthorFromImage(this.props.token, image, id)
  }

  createAuthor(image, fullName) {
    return this.props.createAndAddAuthorToImage(this.props.token, image, fullName)
  }

  fetchPersons(query) {

    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.fetchPersons(this.props.token, queryObj)
  }

  insertImage() {
    const image = this.props.entities.images[this.props.image.data]
    this.props.onSubmit(image)
  }

  renderImagePanel() {
    const image = this.props.entities.image[this.props.image.data]

    const persons = {
      results: this.props.persons.data,
      entities: this.props.entities.persons
    }

    if (image) {
      return (
        <ImagePanel
          image={image}
          persons={persons}
          updateImage={this.updateImage}
          saveImage={this.saveImage}
          addAuthor={this.addAuthor}
          removeAuthor={this.removeAuthor}
          createAuthor={this.createAuthor}
          fetchPersons={this.fetchPersons} />
      )
    } else {
      return null
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
          <div className='c-image-manager__images'>{images}</div>
          <div className='c-image-manager__active'>
          {this.renderImagePanel()}
          </div>
        </div>
        <div className='c-image-manager__footer'>
          <div className='c-image-manger__footer__selected'></div>
          <Button
            disabled={!this.props.image.data}
            onClick={this.insertImage}>Insert</Button>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    images: state.app.images.images,
    image: state.app.images.image,
    persons: state.app.persons,
    entities: {
      images: state.app.entities.images,
      image: state.app.entities.image,
      persons: state.app.entities.persons
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchImages: (params) => {
      dispatch(imagesActions.fetchImages(params))
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
    addAuthorToImage: (token, image, id) => {
      dispatch(imagesActions.addAuthorToImage(token, image, id))
    },
    removeAuthorFromImage: (token, image, id) => {
      dispatch(imagesActions.removeAuthorFromImage(token, image, id))
    },
    createAndAddAuthorToImage: (token, image, fullName) => {
      dispatch(imagesActions.createAndAddAuthorToImage(token, image, fullName))
    },
    fetchPersons: (token, query) => {
      dispatch(personsActions.fetchPersons(token, query))
    }
  }
}

const ImageManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageManagerComponent)

export default ImageManager
