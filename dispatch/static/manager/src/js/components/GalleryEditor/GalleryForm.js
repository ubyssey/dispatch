import R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Measure from 'react-measure'

import { Popover, Position } from '@blueprintjs/core'

import imagesActions from '../../actions/ImagesActions'

import { FormInput, TextInput, ImageInput } from '../inputs'
import DnDThumb from './DnDThumb'
import DnDZone from './DnDZone'
import AttachmentForm from './AttachmentForm'

require('../../../styles/components/imagegallery_editor.scss')

const THUMB_HEIGHT = 175
const THUMB_WIDTH = THUMB_HEIGHT
const THUMB_MAR = 5

const THUMB_X = THUMB_WIDTH + THUMB_MAR
const THUMB_Y = THUMB_HEIGHT + THUMB_MAR

class GalleryFormComponent extends React.Component {

  constructor(props) {
    super(props)

    this.moveOutOfGallery = this.moveOutOfGallery.bind(this)
    this.moveIntoGallery = this.moveIntoGallery.bind(this)
    this.galleryDragHover = this.galleryDragHover.bind(this)
    this.endDrag = this.endDrag.bind(this)

    this.state = {
      offset: {x: 0, y: 0},
      showMoveIcon: false,
      zoneDims: {}
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // make sure hover events aren't triggering render unless the
    // position actually changes
    return this.props.listItem != nextProps.listItem
      || this.props.images != nextProps.images
      || this.props.image != nextProps.image
      || this.state.offset.x != nextState.offset.x
      || this.state.offset.y != nextState.offset.y
      || this.state.showMoveIcon != nextState.showMoveIcon
  }

  computePosition(position) {
    position.x -= this.state.zoneDims.left - THUMB_X/2
    position.y -= this.state.zoneDims.top
    let xIdx = Math.floor(position.x / THUMB_X)
    let yIdx = Math.floor(position.y / THUMB_Y)

    // constraints
    const npr = this.getNumPerRow()
    const nR = this.getNumRows() - 1
    xIdx = xIdx < 0 ? 0 : xIdx
    xIdx = xIdx > npr ? npr : xIdx
    yIdx = yIdx < 0 ? 0 : yIdx
    yIdx = yIdx > nR ? nR : yIdx

    position.x = xIdx*THUMB_WIDTH
    position.y = yIdx*THUMB_Y + this.state.zoneDims.top

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

  moveIntoGallery(id, fromIdx, dropLocation) {
    this.setState({ showMoveIcon: false })

    let xIdx, yIdx, toIdx
    if (dropLocation) {
      const pos = this.computePosition(dropLocation)
      xIdx = pos.xIdx
      yIdx = pos.yIdx
      toIdx = yIdx*this.getNumPerRow() + xIdx
    }

    const images = this.props.listItem.images

    if (typeof fromIdx === 'number') {
      const moveImage = images[fromIdx]

      // construct images list with image in *new* location
      if (fromIdx < toIdx) {
        toIdx-- // offset because of removed entry
      }
      let newImages = R.insert(toIdx,
        moveImage, R.remove(fromIdx, 1, images))

      this.props.update('images', newImages)
      return
    }

    // construct new image list with new image appended
    const newImages = [...(this.props.listItem.images || {}), {
      image_id: id,
      caption: '',
      credit: ''
    }]

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
              // put the rightmost thumbs' popover on the left
              position={(i % this.getNumPerRow() == 0)
                ? Position.LEFT : Position.RIGHT}
              >
                <div
                  className='c-imagegallery-thumb-overlay'
                  style={{
                    width: THUMB_WIDTH,
                    height: THUMB_HEIGHT
                  }}>
                  <div className='c-imgegallery-thumb-overlay-text'>
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
      <form onSubmit={e => e.preventDefault()}>
        <FormInput
          label='Title'
          padded={false}
          error={this.props.errors.title}>
          <TextInput
            placeholder='Name'
            value={this.props.listItem.title || ''}
            fill={true}
            onChange={ e => this.props.update('title', e.target.value) } />
        </FormInput>
        <h2 className='c-imagegallery-editor-heading'>Gallery</h2>
        <Measure
          onMeasure={zoneDims => this.setState({ zoneDims })}>
          <DnDZone
            onDrop={this.moveIntoGallery}
            zoneId='in'
            hover={this.galleryDragHover}>
            {inGalleryImages}
            <span
              className='c-imagegallery-editor-movement-indicator'
              style={{
                display: this.state.showMoveIcon ? 'block' : 'none',
                top: this.state.offset.y,
                left: this.state.offset.x,
              }}
            >↵</span>
          </DnDZone>
        </Measure>

        <FormInput>
          <ImageInput
            onUpdate={(id) => { this.moveIntoGallery(id) }} />
        </FormInput>
      </form>
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
    }
  }
}


const GalleryForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(DragDropContext(HTML5Backend)(GalleryFormComponent))

export default GalleryForm
