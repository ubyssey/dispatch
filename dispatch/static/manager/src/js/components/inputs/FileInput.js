import React from 'react'

import { FileUpload } from '@blueprintjs/core'

export default function FileInputComponent(props) {
  return (
    <div className={`c-input c-input--file${props.fill ? ' c-input--fill' : ''}`}>
      <FileUpload
        fill={true}
        text={props.value.name || props.placeholder}
        onInputChange={e => props.onChange(e.target.files.item(0))} />
    </div>
  )
}
