import React from 'react'

import ItemListHeader from './ItemListHeader'
import ItemListTable from './ItemListTable'

require('../../../styles/components/item_list.scss')

export default function ItemList(props) {

  return (
    <div className='c-item-list'>
      <ItemListHeader
        items={props.items}
        typeSingular={props.typeSingular}
        typePlural={props.typePlural}
        location={props.location}
        currentPage={props.currentPage}
        totalPages={props.totalPages}
        createHandler={props.createHandler}
        toolbarContent={props.toolbarContent}
        actions={props.actions || {}} />
      <ItemListTable
        items={props.items}
        entities={props.entities}
        columns={props.columns}
        headers={props.headers}
        location={props.location}
        emptyMessage={props.emptyMessage}
        createHandler={props.createHandler}
        actions={props.actions || {}} />
    </div>
  )

}
