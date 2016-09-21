import React from 'react'

import { Link } from 'react-router'

import Toolbar from '../Toolbar.jsx'

import { Button, LinkButton } from '../buttons'

export default function ItemListHeader(props) {

  function handleToggleAllItems() {
    props.toggleAllItems(props.data)
  }

  function handleDeleteItems() {
    return props.deleteItems(props.selected)
  }

  function getPageQuery(page) {
    let query = {
      page: page
    }

    if (props.section) {
      query.section = props.section
    }

    return query
  }

  function renderPagination() {
    return `Page ${props.currentPage} of ${props.totalPages}`
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
        <LinkButton to={{ pathname: '/articles/', query: getPageQuery(props.currentPage - 1 ) }}>Prev</LinkButton>
        <LinkButton to={{ pathname: '/articles/', query: getPageQuery(props.currentPage + 1 ) }}>Prev</LinkButton>
        {props.isLoading ? null : renderPagination()}
        </div>
      </div>
    </Toolbar>
  )
}
