import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Button, Intent } from '@blueprintjs/core'

import userActions from '../../actions/UserActions'
import personsActions from '../../actions/PersonsActions'
import invitesActions from '../../actions/InvitesActions'
import PersonEditor from '../../components/PersonEditor'
import { FormInput, TextInput } from '../../components/inputs'
import ConfirmButton from '../../components/inputs/ConfirmButton'

import SelectInput from '../../components/inputs/selects/SelectInput'

require('../../../styles/components/user_form.scss')

const DEFAULT = {
  id: '',
  email: '',
  permission: '',
}

class PersonPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editingUser: false
    }
  }

  componentDidMount() {
    this.props.getUser(this.props.token,  this.props.params.personId)
    this.props.getInvite(this.props.token, this.props.params.personId)
  }

  startEditingUser() {
    this.setState({ editingUser: true })
  }

  resetProps() {
    this.props.setUser(DEFAULT)
    this.props.setInvite(DEFAULT)
  }

  handleDelete() {
    if (this.props.invite.id) {
      this.props.deleteInvite(this.props.token, this.props.invite.id)
    }
    else {
      this.props.deleteUser(this.props.token, this.props.user.id)
    }
    this.resetProps()
  }

  handleSave() {
    if (this.props.invite.id) {
      let invite = this.props.invite
      invite.person = this.props.invite.person.id
      this.props.saveInvite(this.props.token, this.props.invite.id, this.props.invite)
    } else if (!this.props.user.id) {
      this.inviteUser(this.props.token, this.props.invite)
    } else {
      let user = this.props.user
      user.person = this.props.user.person.id
      user.permission_level = this.props.user.permissions
      this.props.saveUser(this.props.token, this.props.user.id, user)
    }
  }

  inviteUser(token, user) {
    user.person = this.props.params.personId
    delete user.id
    this.props.inviteUser(token, user)
  }

  handleUpdate(field, value) {
    if (this.props.user.id) {
      this.props.setUser(R.assoc(field, value, this.props.user))
    }
    else {
      this.props.setInvite(R.assoc(field, value, this.props.invite))

    }
  }

  resetPassword() {
    this.props.resetPassword(this.props.token, this.props.user.id)
  }

  renderEditUserButton() {
    return (
      <div className='u-container u-container--padded c-user-form'>
        <Button
          intent={Intent.SUCCESS}
          onClick={() => this.startEditingUser()}>
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
        onConfirm={() => this.handleDelete()}>
        <span className='pt-icon-standard pt-icon-trash' />{this.props.invite.id ? 'Cancel invitation' : 'Deactivate User'}
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
        <div className='c-user-form__heading'>{this.props.invite.id ? 'Pending Invite' :
        'Account Details'}</div>
        <form onSubmit={e => e.preventDefault()}>
          <FormInput
            label='Email'
            padded={false}>
            <TextInput
              placeholder='name@domain.tld'
              value={this.props.user.email || this.props.invite.email || ''}
              fill={true}
              onChange={e => this.handleUpdate('email', e.target.value)} />
          </FormInput>
          <FormInput
            label='Set Permissions'
            padded={false}>
            <div className='c-user-form__permission-select'>
              <SelectInput
                options={PERMISSIONS}
                selected={this.props.user.permissions || this.props.invite.permissions}
                onChange={(e) => this.handleUpdate('permissions', e.target.value)} />
            </div>
          </FormInput>
        </form>
        <span className='c-user-form__buttons'>
          <Button
            intent={Intent.SUCCESS}
            onClick={() => this.handleSave()}>
            {(this.props.invite.id || this.props.user.id) ? 'Save' : 'Invite'}
          </Button>
        </span>
        <span className='c-user-form__buttons'>
          {this.props.user.id ? resetPasswordButton : null}
        </span>
        <span className='c-user-form__buttons'>
            { (this.props.user.id || this.props.invite.id) ? deleteButton : null}
        </span>
      </div>
    )
  }

  renderUserEditSection() {
    return this.state.editingUser ? this.renderUserForm() : this.renderEditUserButton()
  }

  render() {
    const personEditor = (
      <PersonEditor
        itemId={this.props.params.personId}
        goBack={this.props.router.goBack}
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
    user: state.app.persons.user,
    invite: state.app.persons.invite,
    person: state.app.persons.single,
    token: state.app.auth.token,
    settings: state.app.settings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: (token, personId) => {
      dispatch(personsActions.getUser(token, personId))
    },
    setUser: (user) => {
      dispatch(personsActions.setUser(user))
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
    getInvite: (token, query) => {
      dispatch(personsActions.getInvite(token, query))
    },
    setInvite: (invite) => {
      dispatch(personsActions.setInvite(invite))
    },
    saveInvite: (token, inviteId, data) => {
      dispatch(invitesActions.save(token, inviteId, data))
    },
    deleteInvite: (token, inviteId) => {
      dispatch(invitesActions.delete(token, inviteId))
    },
    resetPassword: (token, id) => {
      dispatch(userActions.resetPassword(token, id))
    }
  }
}

const PersonPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonPageComponent)

export default PersonPage
