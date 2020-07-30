import React from 'react'
import PropTypes from 'prop-types';
import { HTMLSelect } from '@blueprintjs/core'

export default function SelectInput(props) {
  let placeholder = null
  if (props.placeholder) {
    placeholder = (
      <option
        key={0}
        disabled selected hidden>
        {props.placeholder}
      </option>
    )
  }

  const options = props.options.map((option, i) => (
    <option
      key={i+1}
      value={option[0]}>{option[1]}</option>
  ))

  return (
    <HTMLSelect
      value={props.value || props.default || ''}
      onChange={props.onChange}>
      {placeholder}
      {options}
    </HTMLSelect>
  )
}

SelectInput.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  placeholder: PropTypes.string
}

SelectInput.defaultProps = {
  default: null
}
