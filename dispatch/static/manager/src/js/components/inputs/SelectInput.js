import React from 'react'

export default function SelectInput(props) {

  let placeholder = null
  if (props.placeholder) {
    placeholder = <option key={0}>{props.placeholder}</option>
  }

  let options = props.options.map((option, i) => {
    return (
      <option
        key={i+1}
        value={option.value}>{option.label}</option>
    )
  })

  return (
    <div className='pt-select'>
      <select
        value={props.selected}
        onChange={props.onChange}>
        {placeholder}
        {options}
      </select>
    </div>
  )
}
