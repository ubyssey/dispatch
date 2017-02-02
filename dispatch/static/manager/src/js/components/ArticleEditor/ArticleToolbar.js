import React from 'react'
import Toolbar from '../Toolbar'

import { AnchorButton, Intent } from '@blueprintjs/core'

import VersionsDropdown from './toolbar/VersionsDropdown'

export default function ArticleToolbar(props) {

  return (
    <Toolbar>
      <div className='c-article-editor__toolbar'>
        <div className='c-article-editor__toolbar__article-buttons'>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={e => props.saveArticle()}>Update</AnchorButton>
          <AnchorButton>Publish</AnchorButton>
          <AnchorButton>Preview</AnchorButton>
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
