import React from 'react'

import { AnchorButton, Intent, Checkbox } from '@blueprintjs/core'
import ConfirmButton from '../inputs/ConfirmButton'
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
          <ConfirmButton
            className='c-article-editor__toolbar__breaking'
            intent={Intent.DANGER}
            confirmButtonText='Confirm'
            message='Are you sure you want to mark this article as breaking news?'
            onConfirm={() => props.toggleBreakingNews()}>
            <div className='c-article-editor__toolbar__breaking'>
              <span>Breaking News</span>
              <Checkbox
                className='c-article-editor__toolbar__breaking__checkbox'
                checked={props.article.is_breaking}
                onChange={() => 0} />
            </div>
          </ConfirmButton>
        </div>
      </div>
    </Toolbar>
  )
}
