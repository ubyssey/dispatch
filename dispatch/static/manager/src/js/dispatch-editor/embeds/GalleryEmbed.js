import React from 'react'

import { FormInput, GallerySelectInput, TextInput } from '../../components/inputs'

require('../../../styles/components/embeds/image.scss')

function GalleryEmbedComponent(props) {

  return (
    <div className='o-embed o-embed--image'>
      <img className='o-embed--image__image' src={props.data.url} />
      <form>
        <FormInput label='Title'>
          <TextInput
            value={props.data.title}
            placeholder='Title'
            onChange={e => props.updateField('title', e.target.value)} />
        </FormInput>

        <FormInput label='Gallery'>
          <GallerySelectInput
            fill={true}
            selected={props.data.id}
            update={id => props.updateField('id', id)} />
        </FormInput>
      </form>
    </div>
  )

}

export default {
  type: 'gallery',
  component: GalleryEmbedComponent,
  defaultData: {
    id: null,
    title: ''
  },
  showEdit: false
}
