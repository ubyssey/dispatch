import React from 'react'
import { Link } from 'react-router'
import { Button } from '@blueprintjs/core'

export default function LinkButton(props) {
  return (
    <Link
      to={props.to}
      role='button'
      onClick={e => {
        if (props.disabled) {
          e.preventDefault()
        }
      }}>
      <Button {...props}>
        {props.children}
      </Button>
    </Link>
  )
}
