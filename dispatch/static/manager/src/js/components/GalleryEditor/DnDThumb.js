import React from 'react'
import { DragSource } from 'react-dnd'

import ImageThumb from '../modals/ImageManager/ImageThumb'

const imageSource = {
  beginDrag(props) {
    return {
      id: props.image.id,
      idx: props.idx
    }
  },
  endDrag(props, monitor) {
    props.endDrag()
    const drop = monitor.getDropResult()
    if (!drop && props.throwOut) {
      props.throwOut(props.image.id, props.idx)
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const DnDThumb = function(props) {
  const { connectDragSource, isDragging } = props
  const { width, height } = props

  const spanStyle = {
    opacity: isDragging ? 0.5 : 1,
    display: 'inline-block'
  }

  if (width) {
    spanStyle.width = width
  }
  if (height) {
    spanStyle.height = height
  }

  return connectDragSource(
    <div style={spanStyle}>
      <ImageThumb
        width="100%"
        {...props} />
    </div>
  )
}

export default DragSource('image', imageSource, collect)(DnDThumb)
