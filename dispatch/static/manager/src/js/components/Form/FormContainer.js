import React from 'react'

export default function FormContainer(props) {
  return <form className='c-form' {...props}>{props.children}</form>
}
