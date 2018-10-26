import React from 'react'

import { imageSchema } from '../../constants/Schemas'

import ImageInput from '../inputs/ImageInput'

function ImageField(props) {
  return (
    <ImageInput
      removable={false}
      value={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}

ImageField.type = 'image'
ImageField.schema = imageSchema

export default ImageField