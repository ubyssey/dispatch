import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import userActions from '../../actions/UserActions'

class LogoutComponent extends React.Component {
  render() {
    return (
      <Link onClick={() => this.props.onLogout('/login')}>Logout</Link>
    )
  }
}

const mapStateToProps = state => ({
  nextPath: state.app.nextPath
})

const mapDispatchToProps = dispatch => ({
  onLogout: nextPath => {
    dispatch(userActions.unauthenticateUser(nextPath))
  }
})

const Logout = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutComponent)

export default Logout
