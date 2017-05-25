import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

const itemSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    }
  }
}

const itemTarget = {
  hover(props, monitor, component) {

    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    if (dragIndex === hoverIndex) {
      return
    }

    if (!props.inline) {

      const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const hoverClientY = monitor.getClientOffset().y - hoverBoundingRect.top

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
    }

    props.moveItem(dragIndex, hoverIndex)

    monitor.getItem().index = hoverIndex
  }
}

class Item extends React.Component {
  render() {
    const { inline, isDragging, connectDragSource, connectDropTarget } = this.props

    const opacity = isDragging ? 0 : 1
    const style = {
      opacity: opacity,
      display: inline ? 'inline-block' : 'block'
    }

    return connectDragSource(connectDropTarget(
      <li className='c-sortable-list__item' style={style}>
        {this.props.children}
      </li>
    ))
  }
}

Item.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  id: PropTypes.any.isRequired,
  moveItem: PropTypes.func.isRequired,
  inline: PropTypes.bool
}

Item.defaultProps = {
  inline: false
}

const dragSource = DragSource(
  'LIST_ITEM',
  itemSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(Item)

const dropTarget = DropTarget(
  'LIST_ITEM',
  itemTarget,
  connect => ({
    connectDropTarget: connect.dropTarget(),
  })
)(dragSource)

export default dropTarget
