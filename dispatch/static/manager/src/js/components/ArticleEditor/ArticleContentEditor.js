import React from 'react'

// import QuillEditor from './QuillEditor'
import ArticleHeadline from './ArticleHeadline'
import ContentEditor from '../ContentEditor'

import { ImageEmbed, VideoEmbed } from '../ContentEditor/embeds'

const embeds = [
  ImageEmbed,
  VideoEmbed
]

export default class ArticleContentEditor extends React.Component {

  constructor(props) {
    super(props)

    this.handleContentUpdate = this.handleContentUpdate.bind(this)
  }

  handleContentUpdate(contentState) {
    //this.props.onUpdate('_content', contentState)
  }

  render() {
    return (
      <div ref='container' className='c-article-editor'>
        <div className='c-article-editor__inner'>
          <ArticleHeadline
            onUpdate={this.props.onUpdate}
            headline={this.props.article.headline} />
          <div className='c-article-editor__body'>
            <ContentEditor
              scrollOffset={this.refs.container ? this.refs.container.scrollTop : 0}
              content={this.props.article.content}
              isNew={this.props.isNew}
              onUpdate={this.handleContentUpdate}
              openModal={this.props.openModal}
              closeModal={this.props.closeModal}
              embeds={embeds} />
          </div>
        </div>
      </div>
    )
  }
}
