import React from 'react'

import { ImageInput, TextInput, SelectInput } from '../../../components/inputs'

import * as Form from '../../../components/Form'

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
      <Form.Container>
        <Form.Input label='Image'>
          <ImageInput
            fill={true}
            value={props.data.image_id}
            onChange={imageId => props.updateField('image_id', imageId)} />
        </Form.Input>
        <Form.Input label='Style'>
          <SelectInput
            options={STYLE_OPTIONS}
            value={props.data.style}
            onChange={e => props.updateField('style', e.target.value)} />
          <SelectInput
            options={WIDTH_OPTIONS}
            value={props.data.width}
            onChange={e => props.updateField('width', e.target.value)} />
        </Form.Input>
        <Form.Input label='Caption'>
          <TextInput
            fill={true}
            value={props.data.caption}
            onChange={e => props.updateField('caption', e.target.value)} />
        </Form.Input>
        <Form.Input label='Credit'>
          <TextInput
            fill={true}
            value={props.data.credit || ''}
            onChange={e => props.updateField('credit', e.target.value)} />
        </Form.Input>
      </Form.Container>
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
