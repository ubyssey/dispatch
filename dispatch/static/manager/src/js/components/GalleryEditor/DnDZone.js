import React from 'react'
import { DropTarget } from 'react-dnd'

const target = {
  drop(props, monitor) {
    const id = monitor.getItem().id
    const idx = monitor.getItem().idx
    const offset = monitor.getClientOffset()
    props.onDrop(id, idx, offset)
    return {
      over: true,
      zoneId: props.zoneId
    }
  },
  hover(props, monitor) {
    if (typeof props.hover !== 'function') {
      return
    }
    const offset = monitor.getClientOffset()
    props.hover(offset)
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const DnDZone = function(props) {
  const { connectDropTarget, isOver } = props
  return connectDropTarget(
    <div
      className='c-imagegallery-dropzone'
      style={{
        boxShadow: isOver ? '0 0 50px 3px #aaa inset' : 'none'
      }}>
      {props.children}
    </div>
  )
}

export default DropTarget('image', target, collect)(DnDZone)
