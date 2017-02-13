import React from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import * as userActions from '../actions/UserActions'

class LogoutPageComponent extends React.Component {

  componentWillMount() {
    // Start logout procedure here
    this.props.Logout();
  }

  componentDidMount() {
    // Assume it was successful if it reaches here, redirect to login page.
    this.props.redirect();
  }

  render(){
    return (<p>Hasta la vista, baby</p>)
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  Logout: () => {
    dispatch(userActions.unauthenticateUser())
  },
  redirect: () => {
    dispatch(push('/login'))
  }
})

const LogoutPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutPageComponent)

export default LogoutPage
