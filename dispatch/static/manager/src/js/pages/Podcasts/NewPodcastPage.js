import React from 'react'

import PodcastEditor from '../../components/PodcastEditor'

export default function NewPodcastPage(props) {
  return (
    <PodcastEditor
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
