import React from 'react'
import R from 'ramda'

import { FormInput, TextAreaInput } from '../../inputs'

import VideoSelectInput from '../../inputs/selects/VideoSelectInput'

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

        <FormInput
          label='Video'>
          <VideoSelectInput
            value={props.featured_video.video}
            update={updateVideo} />
        </FormInput>

        <FormInput label='Caption'>
          <TextAreaInput
            placeholder='Caption'
            value={props.featured_video.caption || ''}
            rows='2'
            onChange={e => updateCaption(e.target.value)} />
        </FormInput>

        <FormInput label='Credit'>
          <TextAreaInput
            placeholder='Credit'
            value={props.featured_video.credit || ''}
            rows='2'
            onChange={e => updateCredit(e.target.value)} />
        </FormInput>

      </div>
    )
  } else {
    return (
      <div>
        <FormInput
          label='Video'>
          <VideoSelectInput
            update={updateVideo} />
        </FormInput>
      </div>
    )
  }

}
