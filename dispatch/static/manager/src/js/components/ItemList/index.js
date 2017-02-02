import React from 'react'

import ItemListHeader from './ItemListHeader'
import ItemListTable from './ItemListTable'

export default function ItemList(props) {

  return (
    <div className='c-item-list'>
      <ItemListHeader
        items={props.items}
        location={props.location}
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        actions={props.actions} />
      <ItemListTable
        items={props.items}
        entities={props.entities}
        location={props.location}
        createMessage={props.createMessage}
        emptyMessage={props.emptyMessage}
        createRoute={props.createRoute}
        actions={props.actions} />
    </div>
  )

}
