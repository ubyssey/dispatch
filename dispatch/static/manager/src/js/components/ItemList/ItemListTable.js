import React from 'react'
import R from 'ramda'

import ItemListItem from './ItemListItem'
import ItemListItemPlaceholder from './ItemListItemPlaceholder'
import ItemListEmpty from './ItemListEmpty'

export default function ItemListTable(props) {

  if (props.items.isLoading) {
    return (
      <div className='c-item-list__table'>
        <ul>
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
          <ItemListItemPlaceholder />
        </ul>
      </div>
    )
  } else if (!props.items.data.length) {
    return (
      <ItemListEmpty
        query={props.location.query.q}
        createMessage={props.createMessage}
        createRoute={props.createRoute}
        emptyMessage={props.emptyMessage} />
    )
  } else {

    const items = props.items.data.map( id => {
      let item = props.entities[id];
      return (
        <ItemListItem
          type={props.type}
          key={item.id}
          item={item}
          isSelected={R.contains(item.id, props.items.selected)}
          toggleItem={props.actions.toggleItem} />
      )
    })

    return (
      <div className='c-item-list__table'>
        <ul>{items}</ul>
      </div>
    )
  }

}
