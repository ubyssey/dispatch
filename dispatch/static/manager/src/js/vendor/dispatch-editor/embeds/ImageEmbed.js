import React from 'react'

import { ImageInput, FormInput, TextInput } from '../../../components/inputs'

function ImageEmbedComponent(props) {
  return (
    <div className='o-embed o-embed--image'>
      <form>
        <FormInput label='Image'>
          <ImageInput
            fill={true}
            selected={props.data.image_id}
            onChange={imageId => props.updateField('image_id', imageId)} />
        </FormInput>
        <FormInput label='Caption'>
          <TextInput
            fill={true}
            value={props.data.caption}
            onChange={e => props.updateField('caption', e.target.value)} />
        </FormInput>
        <FormInput label='Custom Credit'>
          <TextInput
            fill={true}
            value={props.data.credit || ''}
            onChange={e => props.updateField('credit', e.target.value)} />
        </FormInput>
      </form>
    </div>
  )
}

export default {
  type: 'image',
  component: ImageEmbedComponent,
  defaultData: {
    image_id: null,
    caption: '',
    credit: '',
    url: null
  },
  showEdit: true
}
