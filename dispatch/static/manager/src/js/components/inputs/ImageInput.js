import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import { Button } from '@blueprintjs/core'

import * as modalActions from '../../actions/ModalActions'
import imagesActions from '../../actions/ImagesActions'

import ImageManager from '../modals/ImageManager'

import SortableList from './SortableList'

function Image(props) {
  return (
    <div className='c-input--image__thumb' style={{ backgroundImage: `url('${props.url}')` }}>
      <div
        className='c-input--image__remove'
        onClick={props.onClick}>
        <span className='bp3-icon-standard bp3-icon-cross' />
      </div>
    </div>
  )
}

class ImageInputComponent extends React.Component {

  componentDidMount() {
    this.loadSelected()
  }

  loadSelected() {
    this.getSelected().map(id => this.props.getImage(this.props.token, id))
  }

  getSelected() {
    return this.props.many ? (this.props.value || []) : (this.props.value ? [this.props.value] : [])
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
    return (
      <div className={`c-input c-input--image${this.props.fill ? ' c-input--fill' : ''}`}>
        <SortableList
          items={this.getSelected()}
          entities={this.props.entities}
          onChange={selected => this.props.onChange(selected)}
          inline={this.props.many}
          renderItem={image => (
            <Image
              key={image.id}
              url={this.props.many ? image.url_thumb : image.url_medium}
              onClick={() => this.removeImage(image.id)} />
          )} />
        <Button
          onClick={() => this.chooseImage()}>{this.props.many ? 'Add image' : (this.props.value ? 'Change image' : 'Select image')}
        </Button>
        {(this.props.value && this.props.removable) && <Button
          onClick={() => this.removeImage()}>{'Remove image'}
        </Button>}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    entities: state.app.entities.images,
    token: state.app.auth.token
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    getImage: (token, imageId) => {
      dispatch(imagesActions.get(token, imageId))
    },
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
