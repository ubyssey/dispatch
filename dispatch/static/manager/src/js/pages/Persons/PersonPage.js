import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Button, Intent } from '@blueprintjs/core'

import userActions from '../../actions/UserActions'
import invitesActions from '../../actions/InvitesActions'
import PersonEditor from '../../components/PersonEditor'
import { FormInput, TextInput } from '../../components/inputs'
import ConfirmButton from '../../components/inputs/ConfirmButton'

import SelectInput from '../../components/inputs/selects/SelectInput'

require('../../../styles/components/user_form.scss')

class PersonPageComponent extends React.Component {

  constructor(props) {
    super(props)
    this.props.getUser(this.props.token, {q : this.props.params.personId})
    this.props.listInvites(this.props.token, {q : this.props.params.personId})
    this.state = {
      user : {
        id : '',
        email : '',
        permissions : ''
      }
    }
  }

  getUser() {
    for(var id in this.props.user) {
      if(this.props.user[id].person == this.props.params.personId) {
        return this.props.user[id]
      }
    }
    return null
  }

  initializeUser() {
    const user = this.getUser() ? this.getUser() : this.initializeInvite()
    this.setState({user : R.merge(this.state.user, user)})

  }

  resetUser() {
    const emptyUser = {
      id : '',
      email : '',
      person : this.props.params.personId,
      isNew : true
    }
    this.setState({user : R.merge(this.state.user, emptyUser)})
  }

  getInvite() {
    for(var id in this.props.invite) {
      if(this.props.invite[id].person == this.props.params.personId) {
        return this.props.invite[id]
      }
    }
    return null
  }

  initializeInvite() {
    const newInvite = {
      id : '',
      email : '',
      person : this.props.params.personId,
      isNew : true
    }
    const invite = this.getInvite() ? this.getInvite() : newInvite
    return invite
  }

  handleDelete() {
    if(this.state.user.expiration_date) {
      this.props.deleteInvite(this.props.token, this.state.user.id)
    }
    else {
      this.props.deleteUser(this.props.token, this.state.user.id)
    }
    this.resetUser()
  }

  handleSave() {
    if(this.state.user.isNew) {
      this.props.inviteUser(this.props.token, this.state.user)
    }
    else if(this.state.user.expiration_date) {
      this.props.saveInvite(this.props.token, this.state.user.id, this.state.user)
    }
    else {
      this.props.saveUser(this.props.token, this.state.user.id, this.state.user)
    }
  }

  handleUpdate(field, value) {
    this.setState({user : R.assoc(field, value, this.state.user)})
  }

  resetPassword() {
    this.props.resetPassword(this.props.token, this.state.user.id)
  }

  renderEditUserButton() {
    return (
      <div className='u-container u-container--padded c-user-form'>
        <Button
          intent={Intent.SUCCESS}
          onClick={() => this.initializeUser()}>
          Manage Account
        </Button>
      </div>
    )
  }

  renderUserForm() {

    const PERMISSIONS = [
      ['', ''],
      ['admin', 'admin'],
    ]

    const deleteButton = (
      <ConfirmButton
        intent={Intent.DANGER}
        disabled={this.state.user.isNew}
        onConfirm={() => this.handleDelete()}>
        <span className='pt-icon-standard pt-icon-trash'></span>{this.state.user.expiration_date ? 'Cancel invitation' : 'Deactivate User'}
      </ConfirmButton>
    )

    const resetPasswordButton = (
      <Button
        intent={Intent.SUCCESS}
        onClick={() => this.resetPassword()}>
        Reset Password
      </Button>
    )
    return (
      <div className='u-container u-container--padded c-user-form'>
        <div className='c-user-form__heading'>{this.state.user.expiration_date ? 'Pending Invite' :
        'Account Details'}</div>
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
            label='Set Permissions'
            padded={false}>
            <div className='c-user-form__permission-select'>
              <SelectInput
                options={PERMISSIONS}
                selected={this.state.user.permissions}
                onChange={(e) => this.handleUpdate('permissions', e.target.value)}/>
            </div>
          </FormInput>
        </form>
        <span className='c-user-form__buttons'>
          <Button
            intent={Intent.SUCCESS}
            onClick={() => this.handleSave()}>
            {this.state.user.isNew ? 'Invite' : 'Save'}
          </Button>
        </span>
        <span className='c-user-form__buttons'>
          {this.getUser() ? resetPasswordButton : null}
        </span>
        <span className='c-user-form__buttons'>
            {this.state.user.isNew ? null : deleteButton}
        </span>
      </div>
    )
  }

  renderUserEditSection() {
    const userEditSection = this.state.user.id || this.state.user.isNew ? this.renderUserForm() :  this.renderEditUserButton()

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
    user: state.app.entities.users,
    invite: state.app.entities.invites,
    token: state.app.auth.token,
    settings: state.app.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (token, query) => {
      dispatch(userActions.list(token,query))
    },
    saveUser: (token, userId, data) => {
      dispatch(userActions.save(token, userId, data))
    },
    inviteUser: (token, data) => {
      dispatch(invitesActions.create(token, data))
    },
    deleteUser: (token, userId) => {
      dispatch(userActions.delete(token, userId))
    },
    listInvites: (token, query) => {
      dispatch(invitesActions.list(token, query))
    },
    saveInvite: (token, inviteId, data) => {
      dispatch(invitesActions.save(token, inviteId, data))
    },
    deleteInvite: (token, inviteId) => {
      dispatch(invitesActions.delete(token, inviteId))
    },
    resetPassword: (token, id) => {
      dispatch(userActions.reset_password(token, id))
    }
  }
}

const PersonPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonPageComponent)

export default PersonPage
