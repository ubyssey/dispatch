import React from 'react'
import Dropzone from 'react-dropzone'
import { Button } from '@blueprintjs/core'

import { TextInput, TextAreaInput } from '../inputs'

import * as Form from '../Form'

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
    }
  }

  onDrop(files) {
    this.props.update('image', files[0])
    this.setState({ displayImg: files[0].preview })
  }

  render() {
    return (
      <Form.Container>

        <Form.Input
          label='Full Name'
          error={this.props.errors.full_name}>
          <TextInput
            placeholder='Full Name'
            value={this.props.listItem.full_name || ''}
            fill={true}
            onChange={e => this.props.update('full_name', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Slug'
          error={this.props.errors.slug}>
          <TextInput
            placeholder='Slug'
            value={this.props.listItem.slug || ''}
            fill={true}
            onChange={e => this.props.update('slug', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Title'
          error={this.props.errors.title}>
          <TextInput
            placeholder='Title'
            value={this.props.listItem.title || ''}
            fill={true}
            onChange={e => this.props.update('title', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Facebook'
          error={this.props.errors.facebook_url}>
          <TextInput
            placeholder='Facebook url'
            value={this.props.listItem.facebook_url || ''}
            fill={true}
            onChange={e => this.props.update('facebook_url', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Twitter'
          error={this.props.errors.twitter_url}>
          <TextInput
            placeholder='Twitter handle'
            value={this.props.listItem.twitter_url || ''}
            fill={true}
            onChange={e => this.props.update('twitter_url', e.target.value)} />
        </Form.Input>

        <Dropzone
          className='c-person-form__image__dropzone'
          activeClassName='c-person-form__image__dropzone--active'
          ref={node => {this.dropzone = node}}
          onDrop={files => this.onDrop(files)}
          disableClick={true}
          multiple={false}>
          <div
            className='c-person-form__images__container'>
            {this.state.displayImg || this.props.listItem.image_url ? null :
              <div className='c-person-form__image__dropzone__text'>
                Drop Image Here
              </div>}
            <img
              className='c-person-form__images'
              src={this.state.displayImg || this.props.listItem.image_url} />
          </div>
        </Dropzone>

        <div className='c-person-form__image__button'>
          <Button
            onClick={() => this.dropzone.open()}>Select Image</Button>
        </div>

        {this.props.errors.detail ?
          <div className='bp3-callout bp3-intent-danger c-person-form__image__error'>
            {this.props.errors.detail}
          </div> : null}

        <Form.Input
          label='Description'
          error={this.props.errors.description}>
          <TextAreaInput
            placeholder='Description'
            value={this.props.listItem.description || ''}
            fill={true}
            onChange={e => this.props.update('description', e.target.value)} />
        </Form.Input>

      </Form.Container>
    )
  }
}
