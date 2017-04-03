import React from 'react'

export default function ItemListItem(props) {

  const items = props.columns.map((elem, i) => {
    return (
      <div key={i} className='c-item-list__item__cell'>
        {elem(props.item)}
      </div>
    )
  })

  return (
    <li className={'c-item-list__item' + (props.isSelected ? ' c-item-list__item--selected' : '')}>
      <div
        className='c-item-list__item__cell c-item-list__item__cell--checkbox'
        onClick={() => props.toggleItem(props.item.id)}>
        <input type='checkbox' checked={props.isSelected} />
      </div>
      {items}
    </li>
  )
}
