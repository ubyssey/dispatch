import React from 'react'

export default function FormInput(props) {

  const className = props.padded ? 'c-form-input' : 'c-form-input c-form-input--no-padding'
  const error = (<span className='c-form-input__error pt-tag pt-intent-danger'>{props.error}</span>)

  if (props.label) {
    return (
      <div className={className}>
        <label className='c-form-input__label pt-label'>
          {props.label}
          {props.error ? error : null}
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
