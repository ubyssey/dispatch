import React from 'react'
import R from 'ramda'

import { TextAreaInput } from '../../inputs'
import VideoSelectInput from '../../inputs/selects/VideoSelectInput'

import * as Form from '../../Form'

export default function FeaturedVideoTab(props) {

  function updateVideo(videoId) {
    return props.update(
      'featured_video',
      R.merge(props.featured_video, { video: videoId })
    )
  }

  function updateCaption(caption) {
    return props.update(
      'featured_video',
      R.merge(props.featured_video, { caption: caption })
    )
  }

  function updateCredit(credit) {
    return props.update(
      'featured_video',
      R.merge(props.featured_video, { credit: credit })
    )
  }

  if (props.featured_video && props.featured_video.video) {
    return (
      <div className='c-article-sidebar__panel'>

        <Form.Input label='Video'>
          <VideoSelectInput
            value={props.featured_video.video || ''}
            update={updateVideo} />
        </Form.Input>

        <Form.Input label='Caption'>
          <TextAreaInput
            placeholder='Caption'
            value={props.featured_video.caption || ''}
            rows='2'
            onChange={e => updateCaption(e.target.value)} />
        </Form.Input>

        <Form.Input label='Credit'>
          <TextAreaInput
            placeholder='Credit'
            value={props.featured_video.credit || ''}
            rows='2'
            onChange={e => updateCredit(e.target.value)} />
        </Form.Input>

      </div>
    )
  } else {
    return (
      <div className='c-article-sidebar__panel'>
        <Form.Input label='Video'>
          <VideoSelectInput
            value={props.featured_video ? props.featured_video.video : props.featured_video}
            update={updateVideo} />
        </Form.Input>
      </div>
    )
  }

}
