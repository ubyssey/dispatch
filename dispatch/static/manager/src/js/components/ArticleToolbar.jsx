import React from 'react'
import Toolbar from './Toolbar.jsx'

import { AnchorButton, Intent } from '@blueprintjs/core'

const toolbar = {__html: '<div id="full-toolbar" class="toolbar ql-toolbar ql-snow"><span class="ql-format-group"><button title="Bold" class="pt-button ql-bold"><i class="fa fa-bold"></i></button><button title="Italic" class="pt-button ql-italic"><i class="fa fa-italic"></i></button><button title="Underline" class="pt-button ql-underline"><i class="fa fa-underline"></i></button><button title="H1" data-size="H1" class="pt-button ql-header H1"><span>H1</span></button><button title="H2" data-size="H2" class="pt-button ql-header H2"><span>H2</span></button><button title="H3" data-size="H3" class="pt-button ql-header H3"><span>H3</span></button></span><span class="ql-format-group"><button title="Bullet" class="pt-button ql-bullet"><i class="fa fa-list-ul"></i></button><button title="Link" class="pt-button ql-link"><i class="fa fa-link"></i></button></span></div>'};

export default function ArticleToolbar(props) {

  function saveArticle(e) {
    props.actions.save()
  }

  return (
    <Toolbar>
      <div className='c-article-editor__toolbar'>
        <div className='c-article-editor__toolbar__editor-buttons'>
          <AnchorButton
            title='Bold'
            onClick={props.actions.onBold}>
            <span className='pt-icon-standard pt-icon-bold'></span>
          </AnchorButton>
          <AnchorButton
            title='Italic'
            onClick={props.actions.onItalic}>
            <span className='pt-icon-standard pt-icon-italic'></span>
          </AnchorButton>
          <AnchorButton
            title='Underline'
            onClick={props.actions.onUnderline}>
            <span className='pt-icon-standard pt-icon-underline'></span>
          </AnchorButton>
          <AnchorButton
            title='Header'>
            <span className='pt-icon-standard pt-icon-header'></span>
          </AnchorButton>
          <AnchorButton
            title='List' onClick={props.actions.onBold}>
            <span className='pt-icon-standard pt-icon-properties'></span>
          </AnchorButton>
          <AnchorButton
            title='Link'>
            <span className='pt-icon-standard pt-icon-link'></span>
          </AnchorButton>
        </div>
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
