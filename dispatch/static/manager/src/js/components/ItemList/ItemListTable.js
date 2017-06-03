import React from 'react'
import R from 'ramda'

import ItemListItem from './ItemListItem'
import ItemListItemPlaceholder from './ItemListItemPlaceholder'
import ItemListEmpty from './ItemListEmpty'
import ItemListColumnHeaders from './ItemListColumnHeaders'

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
  } else if (!props.items.ids.length) {
    return (
      <ItemListEmpty
        query={props.location.query.q}
        createHandler={props.createHandler}
        emptyMessage={props.emptyMessage} />
    )
  } else {

    const items = props.items.ids.map( id => {
      let item = props.entities[id]
      return (
        <ItemListItem
          key={item.id}
          columns={props.columns}
          item={item}
          isSelected={R.contains(item.id, props.items.selected)}
          toggleItem={props.actions.toggleItem} />
      )
    })

    return (
      <div className='c-item-list__table'>
        <ul>
          <ItemListColumnHeaders headers={props.headers} />
          {items}
        </ul>
      </div>
    )
  }

}
