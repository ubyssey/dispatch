import React from 'react'

import { FormInput, GallerySelectInput, TextInput } from '../../../components/inputs'

function GalleryEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--gallery'>
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
