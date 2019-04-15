import React from 'react'

import { Button } from '@blueprintjs/core'
import { TextInput } from '../../../components/inputs'

import * as Form from '../../../components/Form'

require('../styles/embeds/video.scss')

class VideoEmbedComponent extends React.Component {

  insertVideo() {
    const id = this.getYoutubeID(this.props.data.url)
    this.props.updateField('id', id)
    this.props.stopEditing()
  }

  getYoutubeID(url) {
    const p = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/
    const [, videoId] = url.match(p) || []
    return videoId
  }

  renderInput() {
    return (
      <div>
        <Form.Container>
          <Form.Input label='URL'>
            <TextInput
              fill={true}
              value={this.props.data.url}
              onChange={e => this.props.updateField('url', e.target.value)} />
          </Form.Input>
          <Button onClick={() => this.insertVideo()}>Insert</Button>
        </Form.Container>
      </div>
    )
  }

  renderVideo() {
    return (
      <div>
        <img
          className='o-embed--video__image'
          src={`http://img.youtube.com/vi/${this.props.data.id}/0.jpg`} />
        <Form.Container>
          <Form.Input label='Title'>
            <TextInput
              fill={true}
              value={this.props.data.title}
              onChange={e => this.props.updateField('title', e.target.value)} />
          </Form.Input>
          <Form.Input label='Caption'>
            <TextInput
              fill={true}
              value={this.props.data.caption}
              onChange={e => this.props.updateField('caption', e.target.value)} />
          </Form.Input>
          <Form.Input label='Credit'>
            <TextInput
              fill={true}
              value={this.props.data.credit}
              onChange={e => this.props.updateField('credit', e.target.value)} />
          </Form.Input>
        </Form.Container>
      </div>

    )
  }

  render(){
    return (
      <div className='o-embed o-embed--video'>
        {this.props.data.id ? this.renderVideo() : this.renderInput()}
      </div>
    )
  }
}

export default {
  type: 'video',
  component: VideoEmbedComponent,
  defaultData: {
    id: null,
    url: '',
    title: '',
    caption: '',
    credit: ''
  }
}
