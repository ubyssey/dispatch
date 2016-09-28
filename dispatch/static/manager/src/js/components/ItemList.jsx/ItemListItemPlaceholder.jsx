import React from 'react'

import PlaceholderBar from '../PlaceholderBar.jsx'

export default function ItemListItemPlaceholder(props) {
  return (
    <li className='c-item-list__item'>
      <div className='c-item-list__item__cell c-item-list__item__cell--checkbox'>
        <input type='checkbox' disabled={true} checked={false} />
      </div>
      <div className='c-item-list__item__cell'>
        <PlaceholderBar />
      </div>
    </li>
  )
}
