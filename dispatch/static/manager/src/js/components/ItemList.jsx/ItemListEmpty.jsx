import React from 'react'

import { LinkButton } from '../inputs'

function renderButton(props) {
  return <LinkButton to={props.createRoute}>{props.createMessage}</LinkButton>
}

function getSearchMessage(query) {
  return `No results for "${query}"`
}

export default function ItemListEmpty(props) {

  const message = !!props.query ? getSearchMessage(props.query) : props.emptyMessage

  return (
    <div className='c-item-list-empty'>
      <div className='c-item-list-empty__container'>
        <p>{message}</p>
        {!!props.query ? null : renderButton(props)}
      </div>
    </div>
  )
}
