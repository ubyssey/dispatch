import React from 'react'
import { connect } from 'react-redux'

import * as userActions from '../actions/UserActions'

require('../../styles/components/login_page.scss')

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
      <div className='c-login-page'>
        <form onSubmit={this.onSubmit}>
          <div className='c-login-page__heading'>
            Dispatch Login
          </div>
          <input
            className='pt-input pt-round'
            name="email"
            type="email"
            placeholder='Email'
            value={this.state.email}
            onChange={this.onChangeEmail} /><br/>
          <input
            className='pt-input pt-round'
            name="password"
            type="password"
            placeholder='Password'
            value={this.state.password}
            onChange={this.onChangePassword} /><br/>
          <button
            className='pt-button pt-large'
            type="submit">
            Login
          </button>
          {this.props.error ? (
            <div className='pt-callout pt-intent-danger'>
              {this.props.error}
            </div>
          ): null}
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    nextPath: state.app.nextPath,
    error: state.app.auth.error
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
