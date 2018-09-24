import React from 'react'

import PodcastEpisodeSelectInput from '../../../components/inputs/selects/PodcastEpisodeSelectInput'
import { FormInput } from '../../../components/inputs'

function PodcastEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--podcast'>
      <form>
        <FormInput label='Podcast'>
        <PodcastEpisodeSelectInput
          fill={true}
          value={props.data.podcast}
          onChange={value => {
            props.updateField('podcast', value)
            props.stopEditing()
          }} />
        </FormInput>
      </form>
    </div>
  )
}

export default {
  type: 'podcast',
  component: PodcastEmbedComponent,
  defaultData: {
    podcast: null
  }
}
