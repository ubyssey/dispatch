import React from 'react'
import { connect } from 'react-redux'
import { Button } from '@blueprintjs/core'

import * as navigationActions from '../../actions/NavigationActions'

function LinkButtonComponent(props) {
  return (
    <Button
      onClick={() => props.goTo(props.to)}
      {...props}>
      {props.children}
    </Button>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    goTo: (route) => {
      dispatch(navigationActions.goTo(route))
    }
  }
}
const LinkButton = connect(
  null,
  mapDispatchToProps
)(LinkButtonComponent)

export default LinkButton
