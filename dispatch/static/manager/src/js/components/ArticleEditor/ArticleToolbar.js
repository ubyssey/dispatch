import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'
import { Toolbar } from '../Toolbar'
import VersionsDropdown from '../Editor/toolbar/VersionsDropdown'

export default function ArticleToolbar(props) {

  const publish = (
    <AnchorButton
      intent={Intent.PRIMARY}
      onClick={() => props.publishArticle()}
      disabled={props.isNew}>
      <span className='pt-icon-standard pt-icon-arrow-up' />Publish
    </AnchorButton>
  )

  const unpublish = (
    <AnchorButton
      intent={Intent.PRIMARY}
      onClick={() => props.unpublishArticle()}
      disabled={props.isNew}>
      <span className='pt-icon-standard pt-icon-arrow-down' />Unpublish
    </AnchorButton>
  )

  const breakingNews = (
    <span className='c-article-toolbar__breaking'>Breaking</span>
  )

  return (
    <Toolbar>
      <div className='c-article-editor__toolbar'>
        <div className='c-article-editor__toolbar__article-buttons'>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={() => props.saveArticle()}>
            <span className='pt-icon-standard pt-icon-small-tick' />Update
          </AnchorButton>
          {props.article.is_published ? unpublish : publish}
          <AnchorButton
            disabled={props.isNew}
            onClick={() => props.previewArticle()}>
            <span className='pt-icon-standard pt-icon-document-open' />Preview
          </AnchorButton>
          <VersionsDropdown
            current_version={props.article.current_version}
            published_version={props.article.published_version}
            latest_version={props.article.latest_version}
            getVersion={props.getVersion} />
          {props.article.currently_breaking ? breakingNews : null}
        </div>
      </div>
    </Toolbar>
  )
}
