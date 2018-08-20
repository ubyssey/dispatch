import React from 'react'

import { InputGroup } from '@blueprintjs/core'

export default function SearchInput(props) {
  return (
    <InputGroup
      type='search'
      leftIcon='search'
      value={props.value || ''}
      disabled={props.disabled}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e)} />
  )
}
