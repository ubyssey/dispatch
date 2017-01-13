import React from 'react'
import { connect } from 'react-redux'

import { AnchorButton } from '@blueprintjs/core'

import * as modalActions from '../../actions/ModalActions'

import ImageManager from '../modals/ImageManager.jsx'

class ImageInputComponent extends React.Component {

  renderImage() {
    return ( <img className='c-input--image__image' src={this.props.image.url} /> )
  }

  chooseImage() {
    this.props.openModal(
      ImageManager,
      {
        onSubmit: function(data) {

          this.props.closeModal()

          this.props.onUpdate(data.id);

        }.bind(this)
      }
    )
  }

  render() {
    return (
      <div className='c-input c-input--image'>
        {this.props.image ? this.renderImage() : null}
        <AnchorButton
          onClick={ e => this.chooseImage() }>{this.props.image ? 'Change image' : 'Select image'}</AnchorButton>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
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

export default ImageInput
