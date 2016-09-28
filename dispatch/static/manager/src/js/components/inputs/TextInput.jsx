import React from 'react'

export default function TextInput(props) {
  return (
    <input
      className='c-text-input'
      type='text'
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange} />
  )
}
