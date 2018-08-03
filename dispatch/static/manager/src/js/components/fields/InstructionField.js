import React from 'react'

function createMarkup(data) { return {__html: String(data)} }

export default function InstructionField(props) {
  return (
    <div style={{fontWeight: 'normal', marginTop: '10px'}} dangerouslySetInnerHTML={createMarkup(props.field.options[1])} />
  )
}
