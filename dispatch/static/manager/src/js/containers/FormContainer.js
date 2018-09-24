import React from 'react'

require('../../styles/components/form_container.scss')

export default function FormContainer(props) {
  return <form className='c-form-container'>{props.children}</form>
}
