import React from 'react'
import { connect } from 'react-redux'

import * as userActions from '../actions/UserActions'

class App extends React.Component {

  componentWillMount() {
    this.checkAuthenticated()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.validToken != this.props.validToken) {
      if (this.props.validToken === false) {
        this.props.onRequireLogin('/')
      }
    }
  }

  checkAuthenticated() {
    this.props.verifyToken(this.props.token)
  }

  render() {
    return this.props.children
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    validToken: state.app.auth.validToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRequireLogin: (nextPath) => {
      dispatch(userActions.requireLogin(nextPath))
    },
    verifyToken: (token) => {
      dispatch(userActions.verifyToken(token))
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
