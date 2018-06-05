import React from 'react'
import { connect } from 'react-redux'

import userActions from '../actions/UserActions'

class App extends React.Component {

  componentWillMount() {
    this.checkAuthenticated()
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
    settings: state.app.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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
