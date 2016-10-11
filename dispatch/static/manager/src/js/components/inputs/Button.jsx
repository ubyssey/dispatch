import React from 'react'

export default function Button(props) {
  return (
    <a className='c-input c-input--button' onClick={props.onClick}>{props.children}</a>
  )
}
