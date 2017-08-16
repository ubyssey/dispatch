import React from 'react'

import ImageInput from '../inputs/ImageInput'

export default function ImageField(props) {
  return (
    <ImageInput
      selected={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}
