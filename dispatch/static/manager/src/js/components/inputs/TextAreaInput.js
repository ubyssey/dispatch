import React from 'react'

export default function TextAreaInput(props) {
  return (
    <textarea
      className='bp3-input bp3-fill'
      placeholder={props.placeholder}
      value={props.value}
      rows={props.rows}
      readOnly={props.readOnly}
      onChange={props.onChange} />
  )
}
