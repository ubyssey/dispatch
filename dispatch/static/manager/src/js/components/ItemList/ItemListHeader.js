import React from 'react'

import Toolbar from '../Toolbar'
import { Button } from '@blueprintjs/core'

import ItemListPagination from './ItemListPagination'
import ItemListSearchBar from './ItemListSearchBar'

export default function ItemListHeader(props) {

  const pagination = (
    <ItemListPagination currentPage={props.currentPage} totalPages={props.totalPages} location={props.location} />
  )

  const createButton = (
    <div className='c-item-list__header__create'>
      {props.createHandler ? props.createHandler() : null}
    </div>
  )

  return (
    <Toolbar>
      <div className='c-item-list__header'>
        <div className='c-item-list__header__left'>
          <div className='c-item-list__header__checkbox'>
            <input type='checkbox'
              checked={props.actions.isAllSelected}
              onChange={() => props.actions.toggleAllItems(props.items.ids)} />
          </div>
          {`${props.items.selected.length} ${props.type} selected`}
          <Button
            className='c-item-list__header__delete'
            onClick={() => props.actions.deleteItems(props.items.selected)}
            disabled={!props.items.selected.length}>Delete</Button>
        </div>
        <div className='c-item-list__header__right'>
          {props.items.isLoaded && props.items.ids.length ? pagination : null}
          <ItemListSearchBar
            query={props.location.query.q}
            searchItems={props.actions.searchItems} />
          {props.createHandler ? createButton : null}
        </div>
      </div>
    </Toolbar>
  )
}
