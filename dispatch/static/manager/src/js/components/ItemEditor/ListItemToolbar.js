import React from 'react'

import { Button, Intent } from '@blueprintjs/core'

import { Toolbar, ToolbarLeft, ToolbarRight } from '../Toolbar'
import ConfirmButtom from '../inputs/ConfirmButton'

export default function ListItemToolbar(props) {

  const deleteButton = (
    <ConfirmButtom
      intent={Intent.DANGER}
      icon='trash'
      disabled={props.isNew}
      onConfirm={() => props.deleteListItem()}>Delete</ConfirmButtom>
  )

  return (
    <Toolbar>
      <ToolbarLeft>
        <ul className='bp3-breadcrumbs'>
          <li><a className='bp3-breadcrumb' href='#' onClick={() => props.goBack()}>{props.typePlural}</a></li>
          <li><span className='bp3-breadcrumb bp3-breadcrumb-current'>{props.isNew ? `New ${props.type}` : props.name}</span></li>
        </ul>
      </ToolbarLeft>
      <ToolbarRight>
        <Button
          intent={Intent.SUCCESS}
          icon='tick'
          onClick={() => props.saveListItem()}>{props.isNew ? 'Save' : 'Update'}</Button>
        {props.extraButton}
        {props.deleteListItem ? deleteButton : null}
      </ToolbarRight>
    </Toolbar>
  )
}
