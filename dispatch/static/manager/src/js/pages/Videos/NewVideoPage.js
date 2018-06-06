import React from 'react'

import VideoEditor from '../../components/VideoEditor'

export default function NewVideoPage(props) {
  return (
    <VideoEditor
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}