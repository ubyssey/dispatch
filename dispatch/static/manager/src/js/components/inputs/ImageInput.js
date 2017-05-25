import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import { AnchorButton } from '@blueprintjs/core'

import * as modalActions from '../../actions/ModalActions'

import ImageManager from '../modals/ImageManager'

function Image(props) {
  return (
    <div className='c-input--image__thumb' style={{ backgroundImage: `url('${props.url}')` }}>
      <div
        className='c-input--image__remove'
        onClick={props.onClick}>
        <span className='pt-icon-standard pt-icon-cross'></span>
      </div>
    </div>
  )
}

class ImageInputComponent extends React.Component {

  getSelected() {
    return this.props.many ? this.props.selected : (this.props.selected ? [this.props.selected] : [])
  }

  addImage(imageId) {
    if (this.props.many) {
      this.props.onChange(
        R.append(imageId, this.getSelected())
      )
    } else {
      this.props.onChange(imageId)
    }
  }

  removeImage(imageId) {
    const selected = this.getSelected()

    if (this.props.many) {
      this.props.onChange(
        R.remove(
          R.findIndex(R.equals(imageId), selected),
          1,
          selected
        )
      )
    } else {
      this.props.onChange(null)
    }
  }

  chooseImage() {
    this.props.openModal(
      ImageManager,
      {
        onSubmit: (data) => {
          this.props.closeModal()
          this.addImage(data.id)
        }
      }
    )
  }

  render() {
    const images = this.getSelected()
      .map(id => this.props.entities[id])
      .map(image => (
        <Image
          key={image.id}
          url={image.url}
          onClick={() => this.removeImage(image.id)} />
      ))

    return (
      <div className={`c-input c-input--image${this.props.fill ? ' c-input--fill' : ''}`}>
        {images}
        <AnchorButton
          onClick={() => this.chooseImage() }>{this.props.image ? 'Change image' : 'Select image'}</AnchorButton>
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (component, props) => {
      dispatch(modalActions.openModal(component, props))
    },
    closeModal: () => {
      dispatch(modalActions.closeModal())
    }
  }
}

const ImageInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageInputComponent)

ImageInput.defaultProps = {
  many: false
}

export default ImageInput
