import React from 'react'

import Headline from '../Editor/Headline'
import ContentEditor from '../ContentEditor'

import { ImageEmbed, VideoEmbed, PullQuoteEmbed, GalleryEmbed, CodeEmbed } from '../ContentEditor/embeds'

const embeds = [
  ImageEmbed,
  VideoEmbed,
  CodeEmbed,
  PullQuoteEmbed,
  GalleryEmbed
]

export default class ArticleContentEditor extends React.Component {

  render() {
    return (
      <div ref='container' className='c-article-editor'>
        <div className='c-article-editor__inner'>
          <Headline
            onUpdate={this.props.onUpdate}
            headline={this.props.article.headline}
            error={this.props.errors.headline}
            field="headline" />
          <div className='c-article-editor__body'>
            <ContentEditor
              scrollOffset={this.refs.container ? this.refs.container.scrollTop : 0}
              content={this.props.article.content}
              isNew={this.props.isNew}
              onUpdate={cs => this.props.onUpdate('_content', cs)}
              openModal={this.props.openModal}
              closeModal={this.props.closeModal}
              embeds={embeds} />
          </div>
        </div>
      </div>
    )
  }

}
