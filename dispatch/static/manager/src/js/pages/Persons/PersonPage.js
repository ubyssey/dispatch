import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Button, Intent } from '@blueprintjs/core'

import userActions from '../../actions/UserActions'
import PersonEditor from '../../components/PersonEditor'
import { FormInput, TextInput } from '../../components/inputs'

require('../../../styles/components/user_form.scss')

class PersonPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.props.listUsers(this.props.token, {q : this.props.params.personId})

    this.state = {
      user : {
        id : '',
        email : '',
        password_a : '',
        password_b : ''
      }
    }
  }

  getUser() {
    for(var id in this.props.entities.remote) {
      if(this.props.entities.remote[id].person == this.props.params.personId) {
        return this.props.entities.remote[id]
      }
    }
    return null
  }

  handleUpdate(field, value) {
    this.setState({user : R.assoc(field, value, this.state.user)})
  }

  saveOrCreateUser() {
    if(this.state.user.isNew == true) {
      this.props.createUser(this.props.token, this.state.user)
    }
    else{
      this.props.saveUser(this.props.token, this.state.user.id, this.state.user)
    }
    this.clearPasswordFields()
  }

  clearPasswordFields() {
    this.setState({user : R.merge(this.state.user, {'password_a' : '', 'password_b' : ''})})
  }

  renderUserForm() {
    const userForm = (
      <div className='u-container u-container--padded c-user-form'>
        <div className='c-user-form__heading'>Account Details</div>
        <form onSubmit={e => e.preventDefault()}>
          <FormInput
            label='Email'
            padded={false}>
            <TextInput
              placeholder='name@domain.tld'
              value={this.state.user ? this.state.user.email : ''}
              fill={true}
              onChange={ e => this.handleUpdate('email', e.target.value) } />
          </FormInput>
          <FormInput
            label='Password'
            padded={false}>
            <TextInput
              placeholder=''
              value={this.state.user ? this.state.user.password_a : ''}
              fill={true}
              type='password'
              onChange={ e => this.handleUpdate('password_a', e.target.value) } />
          </FormInput>
          <FormInput
            label='Password Again'
            padded={false}>
            <TextInput
              placeholder=''
              value={this.state.user ? this.state.user.password_b : ''}
              fill={true}
              type='password'
              onChange={ e => this.handleUpdate('password_b', e.target.value) } />
          </FormInput>
        </form>
        <Button
          intent={Intent.SUCCESS}
          onClick={() => this.saveOrCreateUser()}>
          Save
        </Button>
      </div>
    )
    return userForm
  }

  initializeUser() {
    const emptyUser = {
      id : '',
      email : '',
      password_a : '',
      password_b : '',
      person : this.props.params.personId,
      isNew : true
    }
    const user = this.getUser() ? this.getUser() : emptyUser
    this.setState({user : R.merge(this.state.user, user)})
  }
  renderEditUserButton() {
    return (
      <div className='u-container u-container--padded c-user-form'>
        <Button
          intent={Intent.SUCCESS}
          onClick={() => this.initializeUser()}>
          Edit User
        </Button>
      </div>
    )
  }

  renderUserEditSection() {
    const userEditSection = this.state.user.id || this.state.user.isNew ? this.renderUserForm() : this.renderEditUserButton()

    return userEditSection
  }
  render() {
    const personEditor = (
      <PersonEditor
        itemId={this.props.params.personId}
        goBack={this.props.history.goBack}
        route={this.props.route} />
    )

    return (
      <div>
        {personEditor}
        {this.props.settings.is_admin ? this.renderUserEditSection(): null}
      </div>
    )
  }


}

const mapStateToProps = (state) => {
  return {
    user: state.app.users.single,
    entities: {
      remote: state.app.entities.users
    },
    token: state.app.auth.token,
    settings: state.app.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listUsers: (token, query) => {
      dispatch(userActions.list(token,query))
    },
    getUser: (token, query) => {
      dispatch(userActions.get(token, null, query))
    },
    setUser: (data) => {
      dispatch(userActions.set(data))
    },
    saveUser: (token, userId, data) => {
      dispatch(userActions.save(token, userId, data))
    },
    createUser: (token, data) => {
      dispatch(userActions.create(token, data))
    }
  }
}

const PersonPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonPageComponent)

export default PersonPage
