import React from 'react'

require('isomorphic-fetch')
import fetchJsonp from 'fetch-jsonp'
import url from 'url'

import { Button } from '@blueprintjs/core'
import { FormInput, TextInput } from '../../../components/inputs'

require('../styles/embeds/video.scss')

const TWITTER_API_URL = 'https://api.twitter.com/1.1/statuses/oembed.json'

class TwitterEmbedComponent extends React.Component {

  stripTweetId(url) {
    var id = url.replace(/^(?:https?:\/\/)?(?:www\.)?twitter\.com\/?(\w+)\/(status)\//g, '')
    this.props.updateField('id', id)
    this.props.stopEditing()
  }

  getTweet() {
    fetchJsonp(
      TWITTER_API_URL + url.format({ query: { url: this.props.data.url } })
    )
    .then((response) => response.json())
    .then(data => {
      console.log(data)
      // ADD YOUR CODE HERE
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
