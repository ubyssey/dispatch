import React from 'react'

import { FileInput } from '@blueprintjs/core'

export default function FileInputComponent(props) {
  return (
    <div className={`c-input c-input--file${props.fill ? ' c-input--fill' : ''}`}>
      <FileInput
        fill={true}
        inputProps={{accept: props.accept}}
        text={props.value && props.value.name || props.placeholder}
        onInputChange={e => props.onChange(e.target.files.item(0))} />
    </div>
  )
}
