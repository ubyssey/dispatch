import React from 'react'

import EpisodeEditor from '../../components/PodcastEditor/EpisodeEditor'

export default function PodcastEpisodePage(props) {
  return (
    <EpisodeEditor
      podcastId={props.params.podcastId}
      episodeId={props.params.episodeId}
      route={props.route} />
  )
}
