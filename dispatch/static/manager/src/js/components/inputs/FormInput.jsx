import React from 'react'

export default function FormInput(props) {
  return (
    <div className='c-form-input'>
      <label className='c-form-input__label'>{props.label}</label>
      {props.children}
    </div>
  )
}
