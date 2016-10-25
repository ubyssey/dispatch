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
    this.fetchPersons = this.fetchPersons.bind(this)
  }

  componentDidMount() {
    this.props.fetchImages({ordering: '-created_at'})
  }

  updateImage(id, data) {
    this.props.updateImage(this.props.token, id, data)
  }

  fetchPersons(query) {

    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.fetchPersons(this.props.token, queryObj)
  }

  renderImagePanel() {
    const image = this.props.entities.images[this.props.image.data]

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
        <div className='c-image-manager__footer'></div>
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
    updateImage: (token, imageId, data) => {
      dispatch(imagesActions.updateImage(token, imageId, data))
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
