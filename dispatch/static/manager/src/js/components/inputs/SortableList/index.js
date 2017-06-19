import React from 'react'
import R from 'ramda'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Item from './Item'

require('../../../../styles/components/sortable_list.scss')

class SortableList extends React.Component {

  moveItem(dragIndex, hoverIndex) {

    const dragItem = this.props.items[dragIndex]

    this.props.onChange(
      R.insert(hoverIndex, dragItem, R.remove(dragIndex, 1, this.props.items))
    )
  }

  render() {

    const items = this.props.items.map(id => this.props.entities[id])
      .filter(i => typeof i !== 'undefined')

    return (
      <ul className='c-sortable-list'>
        {items.map((item, i) => (
          <Item
            key={item.id}
            index={i}
            inline={this.props.inline}
            id={item.id}
            moveItem={(dragIndex, hoverIndex) => this.moveItem(dragIndex, hoverIndex)}>
            {this.props.renderItem(item)}
          </Item>
        ))}
      </ul>
    )
  }
}

SortableList.propTypes = {
  onChange: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  items: PropTypes.array,
  entities: PropTypes.object,
  inline: PropTypes.bool
}

SortableList.defaultProps = {
  items: [],
  entities: {},
  inline: false
}

export default DragDropContext(HTML5Backend)(SortableList)
