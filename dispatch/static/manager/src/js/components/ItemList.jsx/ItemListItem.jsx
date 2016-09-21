import React from 'react'

import { Link } from 'react-router'

export default function ItemListItem(props) {

  function handleChange() {
    return props.toggleItem(props.item.id)
  }

  return (
    <li className={'c-item-list__item' + (props.selected ? ' c-item-list__item--selected' : '')}>
      <div className='c-item-list__item__cell c-item-list__item__cell--checkbox' onClick={handleChange}>
        <input type='checkbox' checked={props.selected} />
      </div>
      <div className='c-item-list__item__cell c-item-list__item__cell--title'>
        <Link to={`/articles/${props.item.id}`} dangerouslySetInnerHTML={{__html: props.item.headline}} />
      </div>
      <div className='c-item-list__item__cell'>{props.item.authors_string}</div>
      <div className='c-item-list__item__cell'>{props.item.published_at}</div>
      <div className='c-item-list__item__cell'>{props.item.revision_id + ' revisions'}</div>
    </li>
  )
}
