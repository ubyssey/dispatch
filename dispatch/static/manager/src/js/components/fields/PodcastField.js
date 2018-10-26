import React from 'react'

import { podcastEpisodeSchema } from '../../constants/Schemas'

import PodcastEpisodeSelectInput from '../inputs/selects/PodcastEpisodeSelectInput'

function PodcastField(props) {
  return (
    <PodcastEpisodeSelectInput
      value={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}

PodcastField.type = 'podcast'
PodcastField.schema = podcastEpisodeSchema

export default PodcastField