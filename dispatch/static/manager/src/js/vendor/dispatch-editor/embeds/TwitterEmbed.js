import React from 'react'

import { Button } from '@blueprintjs/core'
import { FormInput, TextInput } from '../../../components/inputs'

require('../styles/embeds/video.scss')

var Twit = require('twit')

var twit = new Twit({
  consumer_key: 'kCIpSvGTADIoCzZXKDJ2fH3Gh',
  consumer_secret: 'VYTFpsfvoxBzVVw4AVGOsiyfRK3oDnr0MMgFSvO0ntitfVrkPU',
  access_token: '407012934-2TtDw9bwW7giqBPLUn1izvTXt5vFa3bU3jPU4w8o',
  access_token_secret: 'yXGIcG0rI5TwqnOQzQcEuEIycIiAqU77KSUh0g5JtD7PQ',
})

class TwitterEmbedComponent extends React.Component {

  stripTweetId(url) {
    var id = url.replace(/^(?:https?:\/\/)?(?:www\.)?twitter\.com\/?(\w+)\/(status)\//g, '')
    this.props.updateField('id', id)
    this.props.stopEditing()
  }

  getTweet() {
    twit.get('statuses/oembed', {url: this.props.data.url}, function (err, data, response) {
      this.props.updateField('tweet', data)
      this.props.stopEditing()
    })
  }

  renderInput() {
    return (
      <div className='o-embed o-embed--tweet'>
        <form>
          <FormInput label='Tweet URL'>
            <TextInput
              fill={true}
              value={this.props.data.url}
              onChange={e => this.props.updateField('url', e.target.value)} />
          </FormInput>
        </form>
        <div className='o-embed--video__button__container'>
          <Button onClick={() => this.getTweet()}>Insert</Button>
        </div>
      </div>
    )
  }

  renderTweet() {
    return (
      <div className='o-embed o-embed--tweet'>
        {this.props.data.tweet}
      </div>
    )
  }

  render() {
    return (
      <div className='o-embed o-embed--tweet'>
        {this.props.data.tweet ? this.renderTweet() : this.renderInput()}
      </div>
    )
  }
}

export default {
  type: 'tweet',
  component: TwitterEmbedComponent,
  defaultData: {
    url: '',
    id: '',
    tweet: ''
  }
}