import React from 'react'

export default function Button(props) {
  return (
    <a className='c-button' onClick={props.onClick}>{props.children}</a>
  )
}
