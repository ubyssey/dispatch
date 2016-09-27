import React from 'react'

import { Link } from 'react-router'

import Toolbar from '../Toolbar.jsx'
import { Button, LinkButton } from '../inputs'

import ItemListPagination from './ItemListPagination.jsx'
import ItemListSearchBar from './ItemListSearchBar.jsx'

export default function ItemListHeader(props) {

  function handleToggleAllItems() {
    props.toggleAllItems(props.data)
  }

  function handleDeleteItems() {
    return props.deleteItems(props.selected)
  }

  function renderPagination() {
    return (
      <ItemListPagination currentPage={props.currentPage} totalPages={props.totalPages} section={props.section} />
    )
  }

  return (
    <Toolbar>
      <div className='c-item-list__header'>
        <div className='c-item-list__header__left'>
          <div className='c-item-list__header__checkbox'>
            <input type='checkbox'
              checked={props.isAllSelected}
              onChange={handleToggleAllItems} />
          </div>
          {`${props.selected.length} articles selected`}
          <Button onClick={handleDeleteItems} disabled={!props.selected.length}>Delete</Button>
        </div>
        <div className='c-item-list__header__right'>
        {props.isLoaded ? renderPagination() : null}
        <ItemListSearchBar />
        </div>
      </div>
    </Toolbar>
  )
}
