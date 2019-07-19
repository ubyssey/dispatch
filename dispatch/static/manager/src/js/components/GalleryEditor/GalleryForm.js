import R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import DragDropContext from './DragDropContext'
import Measure from 'react-measure'
import autobind from 'class-autobind'

import { Popover, Position, Button } from '@blueprintjs/core'

import imagesActions from '../../actions/ImagesActions'
import * as modalActions from '../../actions/ModalActions'

import { TextInput } from '../inputs'
import DnDThumb from './DnDThumb'
import DnDZone from './DnDZone'
import AttachmentForm from './AttachmentForm'
import ImageManager from '../modals/ImageManager'
import * as Form from '../Form'

require('../../../styles/components/gallery_editor.scss')

const THUMB_HEIGHT = 175
const THUMB_WIDTH = THUMB_HEIGHT
const THUMB_MAR = 5

const THUMB_X = THUMB_WIDTH + THUMB_MAR
const THUMB_Y = THUMB_HEIGHT + THUMB_MAR

class GalleryFormComponent extends React.Component {

  constructor(props) {
    super(props)
    autobind(this)

    this.state = {
      offset: { x: 0, y: 0 },
      showMoveIcon: false,
      zoneDims: {}
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // make sure hover events aren't triggering render unless the
    // position actually changes
    return this.props.listItem != nextProps.listItem
      || this.props.errors != nextProps.errors
      || this.props.images != nextProps.images
      || this.props.image != nextProps.image
      || this.state.offset.x != nextState.offset.x
      || this.state.offset.y != nextState.offset.y
      || this.state.showMoveIcon != nextState.showMoveIcon
  }

  computePosition(position) {
    position.x -= this.state.zoneDims.left - THUMB_X / 2
    position.y -= this.state.zoneDims.top
    let xIdx = Math.floor(position.x / THUMB_X)
    let yIdx = Math.floor(position.y / THUMB_Y)

    // constraints
    const npr = this.getNumPerRow()
    const nR = this.getNumRows() - 1
    xIdx = Math.min(Math.max(xIdx, 0), npr)
    yIdx = Math.min(Math.max(yIdx, 0), nR)

    position.x = xIdx * THUMB_WIDTH
    position.y = yIdx * THUMB_Y + this.state.zoneDims.top

    return {
      xIdx,
      yIdx,
      position
    }
  }

  galleryDragHover(position) {
    position = this.computePosition(position).position
    this.setState({
      offset: position,
      showMoveIcon: true
    })
  }

  getNumPerRow() {
    return Math.floor(this.state.zoneDims.width / THUMB_WIDTH)
  }

  getNumRows() {
    if (!this.props.listItem.images) {
      return 1
    }
    return Math.ceil(this.props.listItem.images.length / this.getNumPerRow())
  }

  moveWithinGallery(fromIdx, dropLocation) {
    const { xIdx, yIdx } = this.computePosition(dropLocation)
    let toIdx = yIdx*this.getNumPerRow() + xIdx

    const images = this.props.listItem.images
    const moveImage = images[fromIdx]

    // reduce to index because removed entry is lower than added index
    if (fromIdx < toIdx) {
      toIdx--
    }

    // construct images list with image in *new* location
    let newImages = R.insert(toIdx,
      moveImage, R.remove(fromIdx, 1, images))

    this.props.update('images', newImages)
  }

  addToGallery(ids) {
    const images = this.props.listItem.images

    const makeNewImage = id => {
      return {
        image_id: id,
        caption: '',
        credit: ''
      }
    }

    let newImages
    if (images && images.length) {
      newImages = R.filter(id => R.findIndex(R.either(
        R.propSatisfies(image => image && image.id == id, 'image'),
        R.propEq('image_id', id)
      ), images) === -1, ids)
        .map(makeNewImage)
    } else {
      newImages = R.map(makeNewImage, ids)
    }

    newImages = [...(images || []), ...newImages]
    this.props.update('images', newImages)
  }

  moveOutOfGallery(id, idx) {
    const newImages = R.remove(idx, 1, this.props.listItem.images)
    this.props.update('images', newImages)
  }

  endDrag() {
    this.setState({ showMoveIcon: false })
  }

  handleChange(idx, field, value) {
    const images = this.props.listItem.images
    images[idx][field] = value
    this.props.update('images', images)
  }

  openImageSelector() {
    this.props.openModal(
      ImageManager,
      {
        onSubmit: function(ids) {
          this.props.closeModal()
          this.addToGallery(ids)
        }.bind(this),
        many: true
      }
    )
  }

  clearGallery() {
    this.props.update('images', [])
  }

  render() {
    let i = 1
    const inGalleryImages = this.props.listItem.images ?
      this.props.listItem.images.map((img, idx) => {

        let id = img.image_id
        if (!id) {
          if (!img.image) {
            return
          }
          id = img.image.id
        }

        const image = this.props.entities.remote[id] || img.image

        const form = (
          <AttachmentForm
            caption={img.caption}
            credit={img.credit}
            update={(field, value) => this.handleChange(idx, field, value)} />
        )

        const selected = this.props.image.id === id
        return (
          <div
            style={{
              display: 'inline-block'
            }}
            key={id}>
            <Popover
              isOpen={selected}
              content={form}
              isModal={true}
              onClose={() => { this.props.selectImage(0) }}
              position={(i % this.getNumPerRow() == 0)
                ? Position.LEFT : Position.RIGHT}>
              <div
                className='c-gallery-thumb-overlay'
                style={{
                  width: THUMB_WIDTH,
                  height: 0
                }}>
                <div className='c-gallery-thumb-overlay-text'>
                  {i++}
                </div>
              </div>
            </Popover>
            <DnDThumb
              throwOut={this.moveOutOfGallery}
              image={image}
              idx={idx}
              isSelected={selected}
              selectImage={this.props.selectImage}
              width={THUMB_WIDTH}
              height={THUMB_HEIGHT}
              endDrag={this.endDrag} />
          </div>
        )
      }) : null

    return (
      <Form.Container>

        <Form.Input
          label='Title'
          error={this.props.errors.title}>
          <TextInput
            placeholder='Name'
            value={this.props.listItem.title || ''}
            fill={true}
            onChange={e => this.props.update('title', e.target.value)} />
        </Form.Input>

        <h2 className='c-gallery-editor-heading'>Gallery</h2>
        <Measure
          onMeasure={zoneDims => this.setState({ zoneDims })}>
          {({ measureRef }) =>
            <div ref={measureRef}>
              <DnDZone
                onDrop={this.moveWithinGallery}
                zoneId='in'
                hover={this.galleryDragHover}
                endDrag={this.endDrag}>
                {inGalleryImages}
                <span
                  className='c-gallery-editor-movement-indicator'
                  style={{
                    display: this.state.showMoveIcon ? 'block' : 'none',
                    top: this.state.offset.y,
                    left: this.state.offset.x,
                  }}>↵</span>
              </DnDZone>
            </div>
          }
        </Measure>

        <Button onClick={this.openImageSelector}>
          Add Images
        </Button>

        <div className='c-gallery-clear-button'>
          <Button onClick={this.clearGallery}>
            Clear Gallery
          </Button>
        </div>

      </Form.Container>
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
    selectImage: (imageId) => {
      dispatch(imagesActions.select(imageId))
    },
    openModal: (component, props) => {
      dispatch(modalActions.openModal(component, props))
    },
    closeModal: () => {
      dispatch(modalActions.closeModal())
    }
  }
}

const GalleryForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(DragDropContext(GalleryFormComponent))

export default GalleryForm