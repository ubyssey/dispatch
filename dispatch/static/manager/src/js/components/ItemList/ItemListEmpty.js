import React from 'react'

import { LinkButton } from '../inputs'

export default function ItemListEmpty(props) {

  const message = props.query ? `No results for "${props.query}"` : props.emptyMessage

  const createButton = (
    <LinkButton to={props.createRoute}>{props.createMessage}</LinkButton>
  )

  return (
    <div className='c-item-list-empty'>
      <div className='c-item-list-empty__container'>
        <p>{message}</p>
        {props.query ? null : createButton}
      </div>
    </div>
  )
}
