import React from 'react'

import { Button } from '@blueprintjs/core'

import { Toolbar, ToolbarLeft, ToolbarRight, ToolbarMiddle } from '../Toolbar'
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

  const toolbarLeft = (
    <div>
      <div className='c-item-list__header__checkbox'>
        <input type='checkbox'
          checked={props.actions.isAllSelected}
          onChange={() => props.actions.toggleAllItems(props.items.ids)} />
      </div>
      {`${props.items.selected.length} ${props.typePlural} selected`}
      <Button
        className='c-item-list__header__delete'
        onClick={() => props.actions.deleteItems(props.items.selected)}
        disabled={!props.items.selected.length}>Delete</Button>
    </div>
  )

  const toolbarMiddle = props.middleContent ? (
    <ToolbarMiddle>
      {props.middleContent}
    </ToolbarMiddle>
  ) : null

  return (
    <Toolbar alignLeft={true}>
      <ToolbarLeft>
        {props.actions.toggleAllItems ? toolbarLeft : null}
      </ToolbarLeft>
      {toolbarMiddle}
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
