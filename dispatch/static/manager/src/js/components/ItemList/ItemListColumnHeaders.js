import React from 'react'
import R from 'ramda'

export default function ItemListColumnHeaders(props) {
  if (!props.headers) {
    return null
  }

  // blank first column for checkbox
  const headers = R.insert(0, '', props.headers)

  const items = headers.map((elem, i) => {
    return (
      <div key={i} className='c-item-list__item__cell'>
        {elem}
      </div>
    )
  })

  return (
    <li className='c-item-list__item c-item-list__column-headers'>
      {items}
    </li>
  )
}
