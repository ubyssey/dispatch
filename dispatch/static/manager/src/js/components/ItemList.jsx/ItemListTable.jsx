import React from 'react'
import R from 'ramda'

import ItemListItem from './ItemListItem.jsx'
import ItemListItemPlaceholder from './ItemListItemPlaceholder.jsx'

export default function ItemListTable(props) {

  if (props.isLoading) {
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

    const items = props.items.map( (item) => {
      return (
        <ItemListItem
          key={item.id}
          item={item}
          selected={R.contains(item.id, props.selected)}
          toggleItem={props.toggleItem} />
      )
    })

    return (
      <div className='c-item-list__table'>
        <ul>{items}</ul>
      </div>
    )
  }

}
