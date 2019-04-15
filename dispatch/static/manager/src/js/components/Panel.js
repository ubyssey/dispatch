import React from 'react'

require('../../styles/components/panel.scss')

export default function Panel(props) {
  return (
    <div className='c-panel'>
      <h2 className='c-panel__title'>{props.title}</h2>
      <div className='c-panel__body'>{props.children}</div>
    </div>
  )
}
