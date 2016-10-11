import React from 'react'

import { FormInput, TextInput } from '../inputs'

export default function ImagePanel(props) {
  return (
    <div className='c-image-panel'>
      <img className='c-image-panel__image' src={props.image.thumb} />
      <div className='c-image-panel__filename'>{props.image.filename}</div>
      <form>
        <FormInput label='Title'>
          <TextInput />
        </FormInput>
        <FormInput label='Photographers'>
          <TextInput />
        </FormInput>
      </form>
    </div>
  )
}
