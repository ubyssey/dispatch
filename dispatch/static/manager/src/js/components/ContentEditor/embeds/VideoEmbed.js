import React from 'react'

import { FormInput, TextInput } from '../../inputs'
import { Button } from '@blueprintjs/core'

require('../../../../styles/components/embeds/video.scss')

class VideoEmbedComponent extends React.Component {

  insertVideo() {
    const id = this.getYoutubeID(this.props.data.url)
    this.props.updateField('video_id', id)
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
        <form>
          <FormInput label='URL'>
            <TextInput
              fill={true}
              value={this.props.data.url}
              onChange={e => this.props.updateField('url', e.target.value)} />
          </FormInput>
        </form>
        <div className='o-embed--video__button__container'>
          <Button onClick={() => this.insertVideo()}>Insert</Button>
        </div>
      </div>
    )

  }

  renderVideo() {
    return (
      <div>
        <img
          className='o-embed--video__image'
          src={`http://img.youtube.com/vi/${this.props.data.video_id}/0.jpg`} />
        <form>
          <FormInput label='Title'>
            <TextInput
              fill={true}
              value={this.props.data.title}
              onChange={e => this.props.updateField('title', e.target.value)} />
          </FormInput>
          <FormInput label='Caption'>
            <TextInput
              fill={true}
              value={this.props.data.caption}
              onChange={e => this.props.updateField('caption', e.target.value)} />
          </FormInput>
          <FormInput label='Credit'>
            <TextInput
              fill={true}
              value={this.props.data.credit}
              onChange={e => this.props.updateField('credit', e.target.value)} />
          </FormInput>
        </form>
      </div>

    )
  }

  render(){
    return (
      <div className='o-embed o-embed--video'>
        {this.props.data.video_id ? this.renderVideo() : this.renderInput()}
      </div>
    )
  }
}

export default {
  type: 'video',
  component: VideoEmbedComponent,
  defaultData: {
    video_id: null,
    url: '',
    title: '',
    caption: '',
    credit: ''
  }
}
