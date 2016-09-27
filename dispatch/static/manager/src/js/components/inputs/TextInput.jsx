import React from 'react'

export default function TextInput(props) {
  return (
    <input
      className='c-text-input'
      type='text'
      placeholder={props.placeholder} />
  )
}
