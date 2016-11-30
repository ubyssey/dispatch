import React from 'react'

export default function FormInput(props) {
  return (
    <div className='c-form-input'>
      <label className='c-form-input__label pt-label'>
        {props.label}
        {props.children}
      </label>
    </div>
  )
}
