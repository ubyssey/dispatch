import React from 'react'
import R from 'ramda'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Item from './Item'

require('../../../../styles/components/sortable_list.scss')

class SortableList extends React.Component {

  moveItem(dragIndex, hoverIndex) {

    const dragItem = this.props.items[dragIndex]
    const hoverItem = this.props.items[hoverIndex]

    this.props.onChange(
      R.update(hoverIndex, dragItem, R.update(dragIndex, hoverItem, this.props.items))
    )
  }

  render() {

    const items = this.props.items.map(id => this.props.entities[id])

    return (
      <ul className='c-sortable-list'>
        {items.map((item, i) => (
          <Item
            key={item.id}
            index={i}
            id={item.id}
            text={item[this.props.attribute]}
            moveItem={(dragIndex, hoverIndex) => this.moveItem(dragIndex, hoverIndex)}
          />
        ))}
      </ul>
    )
  }
}

export default DragDropContext(HTML5Backend)(SortableList)
