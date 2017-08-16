import React from 'react'
import { connect } from 'react-redux'

import userActions from '../actions/userActions'

class ProfilePageComponent extends React.Component {
  componentDidMount() {
    this.props.getUser(this.props.token, 'me')
  }

  render() {
    return (
      <h1>This is the Profile Page</h1>
    )
  }
}

const processData = (data) => {
  let formData = new FormData()

  formData.append('title', data.title || '')
  formData.append('description', data.description || '')
  formData.append('host', data.host || '')
  if (data.image instanceof File) {
    formData.append('image', data.image, data.image.name)
  }
  formData.append('location', data.location || '')
  formData.append('address', data.address || '')
  formData.append('category', data.category || '')
  formData.append('facebook_url', data.facebook_url || '')
  formData.append('submitter_email', data.submitter_email || '')
  formData.append('submitter_phone', data.submitter_phone || '')

  return formData
}

const mapStateToProps = (state) => {
  return {
    user: state.app.events.single,
    entities: {
      remote: state.app.entities.users,
      local: state.app.entities.local.users,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (token, eventId) => {
      dispatch(userActions.get(token, eventId))
    },
    saveUser: (token, eventId, data) => {
      dispatch(userActions.save(token, eventId, processData(data)))
    }
  }
}

const ProfilePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePageComponent)

export default ProfilePage
