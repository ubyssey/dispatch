import React from 'react'
import { Link } from 'react-router'

export default function LinkButton(props) {
  return (
    <Link
      className='c-input c-input--button'
      to={props.to}>
      {props.children}
    </Link>
  )
}
