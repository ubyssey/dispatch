import React from 'react'
import R from 'ramda'

import ItemListItem from './ItemListItem.jsx'
import ItemListItemPlaceholder from './ItemListItemPlaceholder.jsx'

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
  } else {

    const items = props.items.data.map( id => {
      let item = props.entities[id];
      return (
        <ItemListItem
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
