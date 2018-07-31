import React from 'react'

import { ImageInput, FormInput, TextInput, SelectInput } from '../../../components/inputs'

const STYLE_OPTIONS = [
  ['default', 'default'],
  ['left', 'left'],
  ['right', 'right'],
]

const WIDTH_OPTIONS = [
  ['', 'full'],
  ['small', 'small'],
  ['medium', 'medium'],
  ['large', 'large'],
]

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
        <FormInput label='Style'>
          <SelectInput
            options={STYLE_OPTIONS}
            selected={props.data.style}
            onChange={e => props.updateField('style', e.target.value)} />
          <SelectInput
            options={WIDTH_OPTIONS}
            selected={props.data.width}
            onChange={e => props.updateField('width', e.target.value)} />
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
    style: 'default',
    width: 'auto',
    caption: '',
    credit: '',
  },
  showEdit: true
}
