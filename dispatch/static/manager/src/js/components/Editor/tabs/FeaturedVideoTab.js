import React from 'react'
import R from 'ramda'

import { FormInput } from '../../inputs'

import VideoSelectInput from '../../inputs/selects/VideoSelectInput'

export default function FeaturedVideoTab(props) {

  function updateVideo(videoId) {
    return props.update(
      'featured_video',
      R.merge(props.featured_video, { video: videoId })        
    )
  }

  if (props.featured_video) {
    return (
      <div>
        <FormInput
          label='Video'>
          <VideoSelectInput
            selected={props.featured_video.video}
            update={updateVideo} />
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
