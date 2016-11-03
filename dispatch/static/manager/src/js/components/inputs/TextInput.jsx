import React from 'react'

export default function TextInput(props) {
  return (
    <input
      className='c-input c-input--text'
      type='text'
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
      onKeyPress={props.onKeyPress} />
  )
}
