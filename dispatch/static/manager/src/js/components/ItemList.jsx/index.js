import React from 'react'

import ItemListHeader from './ItemListHeader.jsx'
import ItemListTable from './ItemListTable.jsx'

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
        actions={props.actions} />
    </div>
  )

}
