import React from 'react'

export default function FormInput(props) {

  const error = (
    <span className='c-form__input__error bp3-tag bp3-intent-danger'>
      {Array.isArray(props.error) ? props.error.join(' ') : props.error}
    </span>
  )

  if (props.label) {
    return (
      <div className='c-form__input'>
        <label className='c-form__input__label bp3-label'>
          {props.label}
          {props.error ? error : null}
          {props.children}
        </label>
      </div>
    )
  } else {
    return (
      <div className='c-form__input'>
        {props.children}
      </div>
    )
  }

}
