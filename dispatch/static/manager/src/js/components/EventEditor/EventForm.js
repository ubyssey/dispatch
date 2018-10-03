import React from 'react'
import Dropzone from 'react-dropzone'
import { Button } from '@blueprintjs/core'

import {
  TextInput,
  TextAreaInput,
  DateTimeInput,
  SelectInput
} from '../inputs'

import * as Form from '../Form'

const CATEGORY_CHOICES = [
  ['sports', 'Sports'],
  ['music', 'Music'],
  ['academic', 'Academic'],
  ['party', 'Party'],
  ['business', 'Business'],
  ['ceremony', 'Ceremony'],
  ['workshop', 'Workshop'],
  ['other', 'Other']
]

export default class EventForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      displayImg: null
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
          label='Title'
          error={this.props.errors.title}>
          <TextInput
            placeholder='Name'
            value={this.props.listItem.title || ''}
            fill={true}
            onChange={e => this.props.update('title', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Description'
          error={this.props.errors.description}>
          <TextAreaInput
            placeholder='Description'
            value={this.props.listItem.description || ''}
            fill={true}
            onChange={e => this.props.update('description', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Host'
          error={this.props.errors.host}>
          <TextInput
            placeholder='Host'
            value={this.props.listItem.host || ''}
            fill={true}
            onChange={e => this.props.update('host', e.target.value)} />
        </Form.Input>

        <Dropzone
          ref={(node) => { this.dropzone = node }}
          className='c-person-form__image__dropzone'
          onDrop={(files) => this.onDrop(files)}
          disableClick={true}
          activeClassName='c-person-form__image__dropzone--active'
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
            onClick={() => this.dropzone.open()}>Select Image
          </Button>
        </div>

        <Form.Input
          label='Start Time'
          error={this.props.errors.start_time}>
          <DateTimeInput
            value={this.props.listItem.start_time}
            onChange={dt => this.props.update('start_time', dt)} />
        </Form.Input>

        <Form.Input
          label='End Time'
          error={this.props.errors.end_time}>
          <DateTimeInput
            value={this.props.listItem.end_time}
            onChange={dt => this.props.update('end_time', dt)} />
        </Form.Input>

        <Form.Input
          label='Location'
          error={this.props.errors.location}>
          <TextInput
            placeholder='Location'
            value={this.props.listItem.location || ''}
            fill={true}
            onChange={e => this.props.update('location', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Address'
          error={this.props.errors.address}>
          <TextInput
            placeholder='Address'
            value={this.props.listItem.address || ''}
            fill={true}
            onChange={e => this.props.update('address', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Category'
          error={this.props.errors.category}>
          <SelectInput
            value={this.props.listItem.category}
            placeholder='Please Select'
            options={CATEGORY_CHOICES}
            onChange={e => this.props.update('category', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Event Link'
          error={this.props.errors.event_url}>
          <TextInput
            placeholder='Event URL Here'
            value={this.props.listItem.event_url || ''}
            fill={true}
            onChange={e => this.props.update('event_url', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Ticket Link'
          error={this.props.errors.ticket_url}>
          <TextInput
            placeholder='Ticket Link'
            value={this.props.listItem.ticket_url || ''}
            fill={true}
            onChange={e => this.props.update('ticket_url', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Submitter Email'
          error={this.props.errors.submitter_email}>
          <TextInput
            placeholder='student@ubc.ca'
            value={this.props.listItem.submitter_email || ''}
            fill={true}
            onChange={e => this.props.update('submitter_email', e.target.value)} />
        </Form.Input>

        <Form.Input
          label='Submitter Phone'
          error={this.props.errors.submitter_phone}>
          <TextInput
            placeholder='(604) ###-####'
            value={this.props.listItem.submitter_phone || ''}
            fill={true}
            onChange={e => this.props.update('submitter_phone', e.target.value)} />
        </Form.Input>
        
      </Form.Container>
    )
  }
}
