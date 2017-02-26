import React from 'react'

require('../../styles/components/toolbar.scss')

export default function Toolbar(props) {

  return (
    <header className='c-toolbar'>{props.children}</header>
  )
}
