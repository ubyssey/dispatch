import React from 'react'
import { Link } from 'react-router'
import { Button, Text, Intent } from '@blueprintjs/core'

import { Toolbar, ToolbarLeft, ToolbarRight } from '../Toolbar'
import VersionsDropdown from '../Editor/toolbar/VersionsDropdown'

export default function PageToolbar(props) {

  const publish = (
    <Button
      intent={Intent.PRIMARY}
      icon='arrow-up'
      onClick={() => props.publishPage()}
      disabled={props.isNew}>Publish</Button>
  )

  const unpublish = (
    <Button
      intent={Intent.PRIMARY}
      icon='arrow-down'
      onClick={() => props.unpublishPage()}
      disabled={props.isNew}>Unpublish</Button>
  )

  return (
    <Toolbar>
      <ToolbarLeft>
        <ul className='bp3-breadcrumbs'>
          <li><Link to='pages' className='bp3-breadcrumb'>Pages</Link></li>
          <li><span className='bp3-breadcrumb bp3-breadcrumb-current'>{props.isNew ? 'New page' : <Text ellipsize={true}>{props.page.title}</Text> }</span></li>
        </ul>
      </ToolbarLeft>
      <ToolbarRight>
        <div className='c-article-editor__toolbar'>
          <div className='c-article-editor__toolbar__article-buttons'>
            <Button
              intent={Intent.SUCCESS}
              icon='small-tick'
              onClick={() => props.savePage()}>Update</Button>
            {props.page.is_published ? unpublish : publish}
            <Button
              disabled={props.isNew}
              icon='eye-open'
              onClick={() => props.previewPage()}>Preview</Button>
            <VersionsDropdown
              current_version={props.page.current_version}
              published_version={props.page.published_version}
              latest_version={props.page.latest_version}
              getVersion={props.getVersion} />
          </div>
        </div>
      </ToolbarRight>
    </Toolbar>
  )
}
