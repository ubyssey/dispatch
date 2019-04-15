import React from 'react'
import { Button } from '@blueprintjs/core'

import ConfirmButton from '../inputs/ConfirmButton'
import { Toolbar, ToolbarLeft, ToolbarRight } from '../Toolbar'
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

  const filtersButton = (
    <Button
      onClick={() => props.toggleFilters()}
      minimal={true}
      icon='filter'
      rightIcon={props.showFilters ? 'caret-up' : 'caret-down'}>Filters</Button>
  )

  const toolbarLeft = (
    <div className='c-item-list__header'>
      <div className='c-item-list__header__checkbox'>
        <input
          type='checkbox'
          checked={props.actions.isAllSelected}
          onChange={() => props.actions.toggleAllItems(props.items.ids)} />
      </div>
      {props.items.selected.length == 1 ?
        `${props.items.selected.length} ${props.typeSingular} selected` :
        `${props.items.selected.length} ${props.typePlural} selected`}
      <ConfirmButton
        className='c-item-list__header__delete'
        onConfirm={() => props.actions.deleteItems(props.items.selected)}
        disabled={!props.items.selected.length}>Delete</ConfirmButton>
      {props.hasFilters && filtersButton}
      {props.toolbarContent}
    </div>
  )

  return (
    <Toolbar alignLeft={true}>
      <ToolbarLeft>
        {props.actions.toggleAllItems ? toolbarLeft : null}
      </ToolbarLeft>
      <ToolbarRight>
        {props.items.isLoaded && props.items.ids.length ? pagination : null}
        <ItemListSearchBar
          query={props.location.query.q}
          searchItems={props.actions.searchItems ? props.actions.searchItems : null} />
        {props.createHandler ? createButton : null}
      </ToolbarRight>
    </Toolbar>
  )
}
