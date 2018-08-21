import React from 'react'

export default function FilterDropdown(props) {
  return (
    <div className='c-item-list__header__filters'>
      <div className='c-item-list__header__filters__button pt-button' style={{display: 'flex', alignItems: 'center'}}>
        <h3>Filters</h3>
        <span className='pt-icon-caret-down pt-icon-standard' />
      </div>
      <div className='c-item-list__header__filters__dropdown'>
        {props.filters}
      </div>
    </div>
  )
}