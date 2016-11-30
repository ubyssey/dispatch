import React from 'react'
import { Link } from 'react-router'
import { Button } from '@blueprintjs/core'

export default function LinkButton(props) {
  return (
    <Link
      to={props.to}>
      <Button>
        {props.children}
      </Button>
    </Link>
  )
}
