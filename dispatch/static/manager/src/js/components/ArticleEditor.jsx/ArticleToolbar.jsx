import React from 'react'
import Toolbar from '../Toolbar.jsx'

import { AnchorButton, Intent } from '@blueprintjs/core'

export default function ArticleToolbar(props) {

  function saveArticle(e) {
    props.actions.save()
  }

  return (
    <Toolbar>
      <div className='c-article-editor__toolbar'>
        <div className='c-article-editor__toolbar__article-buttons'>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={saveArticle}>Update</AnchorButton>
          <AnchorButton>Publish</AnchorButton>
          <AnchorButton>Preview</AnchorButton>
          <AnchorButton>Version</AnchorButton>
        </div>
      </div>
    </Toolbar>
  )
}
