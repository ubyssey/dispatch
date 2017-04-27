import React from 'react'
import Toolbar from '../Toolbar'

import { AnchorButton, Intent } from '@blueprintjs/core'

import VersionsDropdown from './toolbar/VersionsDropdown'

export default function ArticleToolbar(props) {

  const publish = (
    <AnchorButton
      onClick={() => props.publishArticle()}
      disabled={props.isNew}>Publish</AnchorButton>
  )

  const unpublish = (
    <AnchorButton
      onClick={() => props.unpublishArticle()}
      disabled={props.isNew}>Unpublish</AnchorButton>
  )

  return (
    <Toolbar>
      <div className='c-article-editor__toolbar'>
        <div className='c-article-editor__toolbar__article-buttons'>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={() => props.saveArticle()}>Update</AnchorButton>
          {props.article.is_published ? unpublish : publish}
          <AnchorButton 
            disabled={props.isNew}
            onClick={() => props.previewArticle()}>Preview</AnchorButton>
          <VersionsDropdown
            current_version={props.article.current_version}
            published_version={props.article.published_version}
            latest_version={props.article.latest_version}
            fetchArticleVersion={props.fetchArticleVersion} />
        </div>
      </div>
    </Toolbar>
  )
}
