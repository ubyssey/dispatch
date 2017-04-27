import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import Toolbar from '../Toolbar'

export default function SectionToolbar(props) {

  return (
    <Toolbar>
      <AnchorButton
        intent={Intent.SUCCESS}
        onClick={() => props.saveSection()}>{props.isNew ? 'Save' : 'Update'}</AnchorButton>
      <AnchorButton
        intent={Intent.DANGER}
        disabled={props.isNew}
        onClick={() => props.deleteSection()}>
          <span className='pt-icon-standard pt-icon-trash'></span>Delete
        </AnchorButton>
    </Toolbar>
  )
}
