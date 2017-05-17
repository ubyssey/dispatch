import React from 'react'

import Headline from '../Editor/Headline'
import ContentEditor from '../ContentEditor'

import { ImageEmbed, VideoEmbed } from '../ContentEditor/embeds'

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
            <ContentEditor
              scrollOffset={this.refs.container ? this.refs.container.scrollTop : 0}
              content={this.props.page.content}
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
