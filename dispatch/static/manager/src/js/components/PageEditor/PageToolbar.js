import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import { Toolbar } from '../Toolbar'
import VersionsDropdown from '../Editor/toolbar/VersionsDropdown'

export default function PageToolbar(props) {

  const publish = (
    <AnchorButton
      onClick={() => props.publishPage()}
      disabled={props.isNew}>Publish</AnchorButton>
  )

  const unpublish = (
    <AnchorButton
      onClick={() => props.unpublishPage()}
      disabled={props.isNew}>Unpublish</AnchorButton>
  )

  return (
    <Toolbar>
      <div className='c-article-editor__toolbar'>
        <div className='c-article-editor__toolbar__page-buttons'>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={() => props.savePage()}>Update</AnchorButton>
          {props.page.is_published ? unpublish : publish}
          <AnchorButton
            disabled={props.isNew}
            onClick={() => props.previewPage()}>Preview</AnchorButton>
          <VersionsDropdown
            current_version={props.page.current_version}
            published_version={props.page.published_version}
            latest_version={props.page.latest_version}
            getVersion={props.getVersion} />
        </div>
      </div>
    </Toolbar>
  )
}
