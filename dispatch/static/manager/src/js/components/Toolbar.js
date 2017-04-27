import React from 'react'

require('../../styles/components/toolbar.scss')

export function Toolbar(props) {

  const className = props.alignLeft ? 'c-toolbar u-container u-container--align-left' : 'c-toolbar u-container'

  return (
    <header className={className}>{props.children}</header>
  )
}

export function ToolbarLeft(props) {
  return (
    <div className='c-toolbar__left'>{props.children}</div>
  )
}

export function ToolbarRight(props) {
  return (
    <div className='c-toolbar__right'>{props.children}</div>
  )
}

export function ToolbarTitle(props) {
  return (
    <h3 className='c-toolbar__title'>{props.children}</h3>
  )
}
