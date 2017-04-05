import React from 'react'

import ItemListHeader from './ItemListHeader'
import ItemListTable from './ItemListTable'

require('../../../styles/components/item_list.scss')

export default function ItemList(props) {

  return (
    <div className='c-item-list'>
      <ItemListHeader
        items={props.items}
        type={props.type}
        location={props.location}
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        actions={props.actions} />
      <ItemListTable
        items={props.items}
        entities={props.entities}
        columns={props.columns}
        location={props.location}
        emptyMessage={props.emptyMessage}
        createHandler={props.createHandler}
        actions={props.actions} />
    </div>
  )

}
