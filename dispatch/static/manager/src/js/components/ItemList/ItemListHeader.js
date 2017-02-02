import React from 'react'

import { Link } from 'react-router'

import Toolbar from '../Toolbar'
import { Button } from '@blueprintjs/core'

import ItemListPagination from './ItemListPagination'
import ItemListSearchBar from './ItemListSearchBar'

export default function ItemListHeader(props) {

  function handleToggleAllItems() {
    props.actions.toggleAllItems(props.items.data)
  }

  function handleDeleteItems() {
    props.actions.deleteItems(props.items.selected)
  }

  function renderPagination() {
    return (
      <ItemListPagination currentPage={props.currentPage} totalPages={props.totalPages} location={props.location} />
    )
  }

  return (
    <Toolbar>
      <div className='c-item-list__header'>
        <div className='c-item-list__header__left'>
          <div className='c-item-list__header__checkbox'>
            <input type='checkbox'
              checked={props.actions.isAllSelected}
              onChange={handleToggleAllItems} />
          </div>
          {`${props.items.selected.length} articles selected`}
          <Button onClick={handleDeleteItems} disabled={!props.items.selected.length}>Delete</Button>
        </div>
        <div className='c-item-list__header__right'>
        {props.items.isLoaded && props.items.data.length ? renderPagination() : null}
        <ItemListSearchBar query={props.location.query.q} searchItems={props.actions.searchItems} />
        </div>
      </div>
    </Toolbar>
  )
}
