import React from 'react'

export default function SelectInput(props) {

  let options = props.options.map((option, i) => {
    return (
      <option
        key={i}
        value={option.value}>{option.label}</option>
    )
  })

  return (
    <div className='pt-select'>
      <select
        value={props.selected}
        onChange={props.onChange}>{options}</select>
    </div>
  )
}
