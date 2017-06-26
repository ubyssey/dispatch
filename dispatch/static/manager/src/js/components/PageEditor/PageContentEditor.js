import React from 'react'

import Headline from '../Editor/Headline'

import {
  Editor,
  ImageEmbed,
  VideoEmbed,
} from '../../vendor/dispatch-editor'

const embeds = [
  ImageEmbed,
  VideoEmbed
]

export default class PageContentEditor extends React.Component {
  render() {
    return (
      <div ref='container' className='c-article-editor'>
        <div className='c-article-editor__inner'>
          <Headline
            onUpdate={this.props.onUpdate}
            headline={this.props.page.title}
            error={this.props.errors.title}
            field="title" />
          <div className='c-article-editor__body'>
            <Editor
              content={this.props.page.content}
              onUpdate={content => this.props.onUpdate('content', content)}
              embeds={embeds} />
          </div>
        </div>
      </div>
    )
  }
}
