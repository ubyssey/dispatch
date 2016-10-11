import React from 'react'
import { connect } from 'react-redux'

import * as imagesActions from '../../actions/ImagesActions'

import { Button, TextInput } from '../inputs'
import ImageThumb from './ImageThumb.jsx'
import ImagePanel from './ImagePanel.jsx'

class ImageManagerComponent extends React.Component {

  componentDidMount() {
    this.props.fetchImages({ordering: '-created_at'})
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

    const image = this.props.entities.images[this.props.image.data]

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
          {image ? <ImagePanel image={image} /> : null}
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
    entities: {
      images: state.app.entities.images
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchImages: (params) => {
      dispatch(imagesActions.fetchImages(params))
    },
    selectImage: (imageId) => {
      dispatch(imagesActions.selectImage(imageId))
    }
  }
}

const ImageManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageManagerComponent)

export default ImageManager
