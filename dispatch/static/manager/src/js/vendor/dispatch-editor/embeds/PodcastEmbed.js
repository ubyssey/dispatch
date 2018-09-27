import React from 'react'

import PodcastEpisodeSelectInput from '../../../components/inputs/selects/PodcastEpisodeSelectInput'

import * as Form from '../../../components/Form'

function PodcastEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--podcast'>
      <Form.Container>
        <Form.Input label='Podcast'>
          <PodcastEpisodeSelectInput
            fill={true}
            value={props.data.podcast}
            onChange={value => {
              props.updateField('podcast', value)
              props.stopEditing()
            }} />
        </Form.Input>
      </Form.Container>
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
