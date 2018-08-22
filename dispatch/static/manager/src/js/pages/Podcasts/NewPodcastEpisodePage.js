import React from 'react'

import EpisodeEditor from '../../components/PodcastEditor/EpisodeEditor'

export default function NewPodcastEpisodePage(props) {
  return (
    <EpisodeEditor
      isNew={true}
      podcastId={props.params.podcastId}
      route={props.route} />
  )
}
