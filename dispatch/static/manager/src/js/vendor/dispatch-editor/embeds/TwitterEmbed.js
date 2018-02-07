import React from 'react'

import fetchJsonp from 'fetch-jsonp'
import url from 'url'

import { Button } from '@blueprintjs/core'
import { FormInput, TextInput } from '../../../components/inputs'

require('isomorphic-fetch')
require('../styles/embeds/video.scss')

const TWITTER_API_URL = 'https://api.twitter.com/1.1/statuses/oembed.json'

class TwitterEmbedComponent extends React.Component {

  validateTweetURL(url) {
    return /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/?(\w+)\/(status)\/(\d+)/g.test(url)
  }

  getTweet() {
    const that = this
    if (this.validateTweetURL(this.props.data.url)) {
      fetchJsonp(TWITTER_API_URL + url.format({query: {url: this.props.data.url}}))
      .then((response) => response.json())
      .then(data => {
        that.props.updateField('html', data.html)
        that.props.stopEditing()
      })
    }
  }

  renderInput() {
    return (
      <div className='o-embed o-embed--tweet'>
        <form>
          <FormInput label='URL'>
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
      <div dangerouslySetInnerHTML={{__html: `${this.props.data.html}`}} />
    )
  }

  render() {
    return (
      <div className='o-embed o-embed--tweet'>
        {this.props.data.html ? this.renderTweet() : this.renderInput()}
      </div>
    )
  }
}

export default {
  type: 'tweet',
  component: TwitterEmbedComponent,
  defaultData: {
    html: ''
  }
}