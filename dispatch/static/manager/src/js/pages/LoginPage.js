import React from 'react';
import { connect } from 'react-redux'

import * as userActions from '../actions/UserActions'

class LoginPageComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }

    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangePassword = this.onChangePassword.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.onLogin(this.state.email, this.state.password, this.props.nextPath)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.onChangeEmail} /><br/>
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.onChangePassword} /><br/>
          <input type="submit" />
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nextPath: state.app.nextPath
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (email, password, nextPath) => {
      dispatch(userActions.authenticateUser(email, password, nextPath))
    }
  }
}

const LoginPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPageComponent)

export default LoginPage
