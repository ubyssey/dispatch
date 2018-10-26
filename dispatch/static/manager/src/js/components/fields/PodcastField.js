import React from 'react'

import PodcastEpisodeSelectInput from '../inputs/selects/PodcastEpisodeSelectInput'

export default function PodcastField(props) {
  return (
    <PodcastEpisodeSelectInput
      value={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}
