import React from 'react'

import VideoEditor from '../../components/VideoEditor'

export default function NewVideoPage(props) {
  return (
    <VideoEditor
      isNew={true}
      goBack={props.history.goBack}
      route={props.route} />
  )
}