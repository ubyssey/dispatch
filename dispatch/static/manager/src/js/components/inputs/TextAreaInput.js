import React from 'react'

export default function TextAreaInput(props) {
  return (
    <textarea
      className='pt-input pt-fill'
      placeholder={props.placeholder}
      value={props.value}
      rows={props.rows}
      onChange={props.onChange} />
  )
}
