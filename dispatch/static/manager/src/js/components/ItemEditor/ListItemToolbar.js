import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import { Toolbar, ToolbarLeft, ToolbarRight, ToolbarTitle } from '../Toolbar'
import ConfirmButtom from '../inputs/ConfirmButton'

export default function ListItemToolbar(props) {

  const editTitle = (
    <ToolbarTitle><span className='u-text-light'>{props.type}: </span><span>{props.name}</span></ToolbarTitle>
  )

  const newTitle = (
    <ToolbarTitle><span className='u-text-light'>New {props.type}</span></ToolbarTitle>
  )

  const deleteButton = (
    <ConfirmButtom
      intent={Intent.DANGER}
      disabled={props.isNew}
      onConfirm={() => props.deleteListItem()}>
      <span className='pt-icon-standard pt-icon-trash' />Delete
    </ConfirmButtom>
  )

  return (
    <Toolbar>
      <ToolbarLeft>
        <AnchorButton
          onClick={() => props.goBack()}>
          <span className='pt-icon-standard pt-icon-arrow-left' />Back
        </AnchorButton>
        {props.isNew ? newTitle : editTitle}
      </ToolbarLeft>
      <ToolbarRight>
        <AnchorButton
          intent={Intent.SUCCESS}
          onClick={() => props.saveListItem()}>
          <span className='pt-icon-standard pt-icon-tick' />{props.isNew ? 'Save' : 'Update'}
        </AnchorButton>
        {props.extraButton}
        {props.deleteListItem ? deleteButton : null}
      </ToolbarRight>
    </Toolbar>
  )
}
