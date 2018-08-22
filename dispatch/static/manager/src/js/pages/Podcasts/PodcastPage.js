import React from 'react'

import PodcastEditor from '../../components/PodcastEditor'

export default function PodcastPage(props) {
  return (
    <PodcastEditor
      itemId={props.params.podcastId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
