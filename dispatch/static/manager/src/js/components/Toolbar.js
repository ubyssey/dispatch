import React from 'react'

require('../../styles/components/toolbar.scss')

export default function Toolbar(props) {

  const className = props.alignLeft ? 'c-toolbar u-container u-container--align-left' : 'c-toolbar u-container'

  return (
    <header className={className}>{props.children}</header>
  )
}
