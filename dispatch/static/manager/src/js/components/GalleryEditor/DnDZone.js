import React from 'react'
import { DropTarget } from 'react-dnd'

const target = {
  drop(props, monitor) {
    const idx = monitor.getItem().idx
    const offset = monitor.getClientOffset()
    props.onDrop(idx, offset)
    return {
      over: true,
      zoneId: props.zoneId
    }
  },
  hover(props, monitor) {
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

class DnDZone extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.isOver && !nextProps.isOver) {
      this.props.endDrag()
    }
  }

  render() {
    const { connectDropTarget, isOver } = this.props
    return connectDropTarget(
      <div
        className='c-gallery-dropzone'
        style={{
          boxShadow: isOver ? '0 0 50px 3px #aaa inset' : 'none'
        }}>
        {this.props.children}
      </div>
    )
  }
}

export default DropTarget('image', target, collect)(DnDZone)
