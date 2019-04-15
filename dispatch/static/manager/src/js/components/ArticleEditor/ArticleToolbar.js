import React from 'react'
import { Link } from 'react-router'
import { Button, Intent, Text } from '@blueprintjs/core'

import { Toolbar, ToolbarLeft, ToolbarRight } from '../Toolbar'
import VersionsDropdown from '../Editor/toolbar/VersionsDropdown'

export default function ArticleToolbar(props) {

  const publish = (
    <Button
      intent={Intent.PRIMARY}
      icon='arrow-up'
      onClick={() => props.publishArticle()}
      disabled={props.isNew}>Publish</Button>
  )

  const unpublish = (
    <Button
      intent={Intent.PRIMARY}
      icon='arrow-down'
      onClick={() => props.unpublishArticle()}
      disabled={props.isNew}>Unpublish</Button>
  )

  const breakingNews = (
    <span className='c-article-toolbar__breaking'>Breaking</span>
  )

  return (
    <Toolbar>
      <ToolbarLeft>
        <ul className='bp3-breadcrumbs'>
          <li><Link to='articles' className='bp3-breadcrumb'>Articles</Link></li>
          <li><span className='bp3-breadcrumb bp3-breadcrumb-current'>{props.isNew ? 'New article' : <Text ellipsize={true}>{props.article.headline}</Text> }</span></li>
        </ul>
      </ToolbarLeft>
      <ToolbarRight>
        <div className='c-article-editor__toolbar'>
          <div className='c-article-editor__toolbar__article-buttons'>
            <Button
              intent={Intent.SUCCESS}
              icon='small-tick'
              onClick={() => props.saveArticle()}>Update</Button>
            {props.article.is_published ? unpublish : publish}
            <Button
              disabled={props.isNew}
              icon='eye-open'
              onClick={() => props.previewArticle()}>Preview</Button>
            <VersionsDropdown
              current_version={props.article.current_version}
              published_version={props.article.published_version}
              latest_version={props.article.latest_version}
              getVersion={props.getVersion} />
            {props.article.currently_breaking ? breakingNews : null}
          </div>
        </div>
      </ToolbarRight>
    </Toolbar>
  )
}
