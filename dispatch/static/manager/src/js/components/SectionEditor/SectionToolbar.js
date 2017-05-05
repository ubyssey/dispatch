import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import { Toolbar, ToolbarLeft, ToolbarRight, ToolbarTitle } from '../Toolbar'

export default function SectionToolbar(props) {

  const editTitle = (
    <ToolbarTitle><span className='u-text-light'>Section: </span><span>{props.name}</span></ToolbarTitle>
  )

  const newTitle = (
    <ToolbarTitle><span className='u-text-light'>New section</span></ToolbarTitle>
  )

  return (
    <Toolbar>
      <ToolbarLeft>
        <AnchorButton
          onClick={() => props.goBack()}>
          <span className='pt-icon-standard pt-icon-arrow-left'></span>Back
        </AnchorButton>
        {props.isNew ? newTitle : editTitle}
      </ToolbarLeft>
      <ToolbarRight>
        <AnchorButton
          intent={Intent.SUCCESS}
          onClick={() => props.saveSection()}>
          <span className='pt-icon-standard pt-icon-tick'></span>{props.isNew ? 'Save' : 'Update'}</AnchorButton>
        <AnchorButton
          intent={Intent.DANGER}
          disabled={props.isNew}
          onClick={() => props.deleteSection()}>
          <span className='pt-icon-standard pt-icon-trash'></span>Delete
        </AnchorButton>
      </ToolbarRight>
    </Toolbar>
  )
}
