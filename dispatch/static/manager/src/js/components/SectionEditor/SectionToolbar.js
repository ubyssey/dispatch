import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import Toolbar from '../Toolbar'

export default function SectionToolbar(props) {

  return (
    <Toolbar>
      <div className='c-section-editor__toolbar'>
        <AnchorButton
          intent={Intent.SUCCESS}
          onClick={() => props.saveSection()}>Update</AnchorButton>
      </div>
    </Toolbar>
  )
}
