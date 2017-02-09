import React from 'react'

export default function FormInput(props) {

  if (props.label) {
    return (
      <div className='c-form-input'>
        <label className='c-form-input__label pt-label'>
          {props.label}
          {props.children}
        </label>
      </div>
    )
  } else {
    return (
      <div className='c-form-input'>
        {props.children}
      </div>
    )
  }

}
