import React from 'react'

import { FormInput, TextInput } from '../../inputs'
import { Button } from '@blueprintjs/core'

require('../../../../styles/components/embeds/video.scss')

class VideoEmbedComponent extends React.Component {

  handleUrlChange(e){
    e.preventDefault()
    this.props.updateField('url', e.target.value)
  }

  handleTitleChange(e){
    e.preventDefault()
    this.props.updateField('title', e.target.value)
  }

  handleCaptionChange(e){
    e.preventDefault()
    this.props.updateField('caption', e.target.value)
  }

  handleCreditChange(e){
    e.preventDefault()
    this.props.updateField('credit', e.target.value)
  }

  insertVideo(){
    const id = this.getYoutubeID(this.props.data.url)
    this.props.updateField('id',id)
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
              onChange={e => this.handleUrlChange(e)} />
          </FormInput>
        </form>
        <Button onClick={e => this.insertVideo()}>Insert</Button>
      </div>
    )

  }

  renderVideo() {
    return (
      <div>
        <img
        className='o-embed--video__image'
        src={`http://img.youtube.com/vi/${this.props.data.id}/0.jpg`} />
        <form>
          <FormInput label='Title'>
            <TextInput
              fill={true}
              value={this.props.data.title}
              onChange={e => this.handleTitleChange(e)}
               />
          </FormInput>
          <FormInput label='Caption'>
            <TextInput
              fill={true}
              value={this.props.data.caption}
              onChange={e => this.handleCaptionChange(e)}
               />
          </FormInput>
          <FormInput label='Credit'>
            <TextInput
              fill={true}
              value={this.props.data.credit}
              onChange={e => this.handleCreditChange(e)}
               />
          </FormInput>
        </form>
      </div>

    )
  }

  render(){
    return(
      <div className='o-embed o-embed--video'>
        {this.props.data.id ? this.renderVideo() : this.renderInput()}
      </div>
    )

  }
}

export default {
  type: 'Video',
  component: VideoEmbedComponent
}
