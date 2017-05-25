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

    props.moveItem(dragIndex, hoverIndex)

    monitor.getItem().index = hoverIndex
  }
}

class Item extends React.Component {
  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props

    const opacity = isDragging ? 0.5 : 1

    return connectDragSource(connectDropTarget(
      <li className='c-sortable-list__item' style={{ opacity: opacity }}>
        {text}
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
  text: PropTypes.string.isRequired,
  moveItem: PropTypes.func.isRequired,
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
