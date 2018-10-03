import React from 'react'

export default function FormContainer(props) {
  return <form 
    className='c-form'
    onSubmit={e => e.preventDefault()}
    {...props}>{props.children}</form>
}
