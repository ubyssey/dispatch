import React from 'react'

export default function ItemListEmpty(props) {

  const message = props.query ? `No results for "${props.query}"` : props.emptyMessage

  return (
    <div className='c-item-list-empty'>
      <div className='c-item-list-empty__container'>
        <p>{message}</p>
        {props.query || !props.createHandler ? null : props.createHandler()}
      </div>
    </div>
  )
}
