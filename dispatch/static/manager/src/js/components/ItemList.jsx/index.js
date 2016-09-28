import React from 'react'

import ItemListHeader from './ItemListHeader.jsx'
import ItemListTable from './ItemListTable.jsx'

export default function ItemList(props) {

  const items = props.data.map( id => props.entities[id] )

  return (
    <div className='c-item-list'>
      <ItemListHeader
        data={props.data}
        selected={props.selected}
        isLoaded={props.isLoaded}
        isLoading={props.isLoading}
        section={props.section}
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        deleteItems={props.deleteItems}
        searchItems={props.searchItems}
        toggleAllItems={props.toggleAllItems} />
      <ItemListTable
        items={items}
        selected={props.selected}
        isLoading={props.isLoading}
        toggleItem={props.toggleItem} />
    </div>
  )

}
