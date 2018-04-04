import React from 'react'
import Dropzone from 'react-dropzone'
import { AnchorButton } from '@blueprintjs/core'

import { FormInput, TextInput, TextAreaInput } from '../inputs'

require('../../../styles/components/person_form.scss')

export default class PersonForm extends React.Component {
  listPersons(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPersons(this.props.token, queryObj)
  }

  constructor(props) {
    super(props)

    this.state = {
      displayImg: null,
      creatingUser: false
    }
  }

  onDrop(files) {
    this.props.update('image', files[0])
    this.setState({ displayImg: files[0].preview })
  }

  handleChange() {
    this.setState({creatingUser: !this.state.creatingUser})
  }

  renderCreateUserButton() {
    return (
      <AnchorButton
        onClick={() => this.handleChange()}>Create User</AnchorButton>
    )
  }

  renderUserForm() {
    return (
      <div>
        <FormInput
          label='email'
          padded={false}
          error={this.props.errors.email}>
          <TextInput
            placeholder='Enter e-mail address'
            value={this.props.listItem.email}
            fill={true}
            onChange={ e => this.props.update('email', e.target.value) } />
        </FormInput>
        <FormInput
          label='Password'
          padded={false}
          error={this.props.errors.email}>
          <TextInput
            placeholder='Enter password'
            value={this.props.listItem.password}
            fill={true}
            onChange={ e => this.props.update('passwordA', e.target.value) } />
        </FormInput>
        <FormInput
          label='Confirm password'
          padded={false}
          error={this.props.errors.email}>
          <TextInput
            placeholder='Confirm password'
            value={this.props.listItem.password}
            fill={true}
            onChange={ e => this.props.update('passwordB', e.target.value) } />
        </FormInput>
        <FormInput
          label='Create admin user?'
          padded={false}>
          <input
            name='admin'
            type='checkbox'
            onChange={e => this.props.update('is_staff', e.target.value)}
            />
        </FormInput>
        <AnchorButton
          onClick={() => this.handleChange()}>Cancel</AnchorButton>
      </div>

    )
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <FormInput
          label='Full Name'
          padded={false}
          error={this.props.errors.full_name}>
          <TextInput
            placeholder='Full Name'
            value={this.props.listItem.full_name || ''}
            fill={true}
            onChange={ e => this.props.update('full_name', e.target.value) } />
        </FormInput>
        <FormInput
          label='Slug'
          padded={false}
          error={this.props.errors.slug}>
          <TextInput
            placeholder='Slug'
            value={this.props.listItem.slug || ''}
            fill={true}
            onChange={ e => this.props.update('slug', e.target.value) } />
        </FormInput>
        <FormInput
          label='Facebook'
          padded={false}
          error={this.props.errors.facebook_url}>
          <TextInput
            placeholder='Facebook url'
            value={this.props.listItem.facebook_url || ''}
            fill={true}
            onChange={ e => this.props.update('facebook_url', e.target.value) } />
        </FormInput>
        <FormInput
          label='Twitter'
          padded={false}
          error={this.props.errors.twitter_url}>
          <TextInput
            placeholder='Twitter handle'
            value={this.props.listItem.twitter_url || ''}
            fill={true}
            onChange={ e => this.props.update('twitter_url', e.target.value) } />
        </FormInput>
        <div>
          {this.props.settings.is_admin && !this.state.creatingUser ? this.renderCreateUserButton() : ''}
          {this.state.creatingUser ? this.renderUserForm() : ''}
        </div>
        <Dropzone
          ref={(node) => { this.dropzone = node }}
          className='c-person-form__image__dropzone'
          onDrop={(files) => this.onDrop(files)}
          disableClick={true}
          activeClassName='c-person-form__image__dropzone--active'
          multiple={false}>
          <div
            className='c-person-form__images__container'>
            {this.state.displayImg || this.props.listItem.image ? null :
              <div className='c-person-form__image__dropzone__text'>
                Drop Image Here
              </div>}
            <img
              className='c-person-form__images'
              src={this.state.displayImg || this.props.listItem.image}/>
          </div>
        </Dropzone>

        <div className='c-person-form__image__button'>
          <AnchorButton
            onClick={() => this.dropzone.open()}>Select Image</AnchorButton>
        </div>

        {this.props.errors.detail ?
          <div className='pt-callout pt-intent-danger c-person-form__image__error'>
            {this.props.errors.detail}
          </div> : null}


        <FormInput
          label='Description'
          padded={false}
          error={this.props.errors.description}>
          <TextAreaInput
            placeholder='Description'
            value={this.props.listItem.description || ''}
            fill={true}
            onChange={ e => this.props.update('description', e.target.value) } />
        </FormInput>
      </form>
    )
  }
}
