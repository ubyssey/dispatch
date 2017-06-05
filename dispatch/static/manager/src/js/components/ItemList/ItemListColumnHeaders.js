import React from 'react'

export default function ItemListColumnHeaders(props) {
  if (!props.headers) {
    return null
  }

  const items = props.headers.map((elem, i) => {
    return (
      <div key={i+1} className='c-item-list__item__cell'>
        {elem}
      </div>
    )
  })

  return (
    <li className='c-item-list__item c-item-list__column-headers'>
      <div key={0} className='c-item-list__item__cell' />
      {items}
    </li>
  )
}
