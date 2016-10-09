import React from 'react'

// import QuillEditor from './QuillEditor.jsx'
import ArticleHeadline from './ArticleHeadline.jsx'
import ContentEditor from './ContentEditor.jsx'

import { ImageEmbed } from './ContentEditor.jsx/embeds'

const embeds = [
  ImageEmbed
]

export default function ArticleEditor(props) {

  return (
    <div className='c-article-editor'>
      <div className='c-article-editor__inner'>
        <ArticleHeadline update={props.update} headline={props.article.headline} />
        <div className='c-article-editor__body'>
          <ContentEditor
            update={props.update}
            openModal={props.openModal}
            closeModal={props.closeModal}
            content={props.article.content}
            embeds={embeds} />
        </div>
      </div>
    </div>
  )
}
