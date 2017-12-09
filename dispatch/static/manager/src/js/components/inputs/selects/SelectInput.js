import React from 'react'

export default function SelectInput(props) {

  let placeholder = null
  if (props.placeholder) {
    placeholder = <option key={0} disabled selected hidden>{props.placeholder}</option>
  }

  const options = props.options.map((option, i) => (
    <option
      key={i+1}
      value={option[0]}>{option[1]}</option>
  ))

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
