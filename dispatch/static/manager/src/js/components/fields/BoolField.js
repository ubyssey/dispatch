import React from 'react'

export default function BoolField(props) {
  return (
    <input
      type='checkbox'
      checked={props.data || false}
      onChange={e => props.onChange(e.target.checked)} />
  )
}
