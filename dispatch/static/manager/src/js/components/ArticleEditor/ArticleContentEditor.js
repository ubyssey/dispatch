import React from 'react'

// import QuillEditor from './QuillEditor'
import ArticleHeadline from './ArticleHeadline'
import ContentEditor from '../ContentEditor'

import { ImageEmbed, VideoEmbed } from '../ContentEditor/embeds'

const embeds = [
  ImageEmbed,
  VideoEmbed
]

export default function ArticleContentEditor(props) {

  return (
    <div ref='container' className='c-article-editor'>
      <div className='c-article-editor__inner'>
        <ArticleHeadline
          onUpdate={props.onUpdate}
          headline={props.article.headline} />
        <div className='c-article-editor__body'>
          <ContentEditor
            scrollOffset={this.refs.container ? this.refs.container.scrollTop : 0}
            content={props.article.content}
            isNew={props.isNew}
            onUpdate={cs => props.onUpdate('_content', cs)}
            openModal={props.openModal}
            closeModal={props.closeModal}
            embeds={embeds} />
        </div>
      </div>
    </div>
  )
  
}
