import React from 'react'

export default function FormSection(props) {
  return (
    <div className='c-form-section'>
      <h2 className='c-form-section__title'>{props.title}</h2>
      {props.children}
    </div>
  )
}
