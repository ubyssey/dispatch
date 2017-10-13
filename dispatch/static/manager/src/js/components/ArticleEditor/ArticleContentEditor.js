import React from 'react'

import Headline from '../Editor/Headline'

import {
  Editor,
  ImageEmbed,
  VideoEmbed,
  PullQuoteEmbed,
  GalleryEmbed,
  CodeEmbed,
  WidgetEmbed,
  TwitterEmbed
} from '../../vendor/dispatch-editor'

const embeds = [
  ImageEmbed,
  VideoEmbed,
  CodeEmbed,
  PullQuoteEmbed,
  GalleryEmbed,
  WidgetEmbed,
  TwitterEmbed
];

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
            <Editor
              content={this.props.article.content}
              onUpdate={content => this.props.onUpdate('content', content)}
              embeds={embeds} />
          </div>
        </div>
      </div>
    )
  }
}
