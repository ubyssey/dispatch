import React from 'react'
import { connect } from 'react-redux'

import * as userActions from '../actions/UserActions'

class LogoutPageComponent extends React.Component {

  componentDidMount() {
    this.props.logoutUser(this.props.token)
  }

  render() {
    return (
      <div>Logging out...</div>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: (token) => {
      dispatch(userActions.logoutUser(token))
    }
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token
  }
}

const LogoutPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutPageComponent)

export default LogoutPage
