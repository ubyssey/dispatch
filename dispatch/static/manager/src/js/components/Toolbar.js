import React from 'react'

require('../../styles/components/toolbar.scss')

export function Toolbar(props) {
  return (
    <header className='c-toolbar'>{props.children}</header>
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
