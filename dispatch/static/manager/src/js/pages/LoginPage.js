import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import userActions from '../actions/UserActions'

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
      <DocumentTitle title='Dispatch'>
        <div className='c-login-page'>
          <form onSubmit={this.onSubmit} className='bp3-card bp3-dark bp3-elevation-1'>
            <h1 className='c-login-page__heading'>
              <span className="bp3-icon bp3-icon-selection" /> dispatch
            </h1>
            <input
              className='bp3-input'
              name="email"
              type="email"
              placeholder='Email'
              value={this.state.email}
              onChange={this.onChangeEmail} /><br />
            <input
              className='bp3-input'
              name="password"
              type="password"
              placeholder='Password'
              value={this.state.password}
              onChange={this.onChangePassword} /><br />
            <button
              className='bp3-button'
              type="submit">
              Login
            </button>
            {this.props.error ? (
              <div className='bp3-callout bp3-intent-danger'>
                {this.props.error}
              </div>
            ): null}
          </form>
        </div>
      </DocumentTitle>
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
