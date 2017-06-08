import React from 'react'
import Dropzone from 'react-dropzone'
import { AnchorButton } from '@blueprintjs/core'

import { FormInput, TextInput, TextAreaInput, DateTimeInput, SelectInput } from '../inputs'

const CATEGORY_CHOICES = [
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'academic', label: 'Academic' },
    { value: 'party', label: 'Party' },
    { value: 'business', label: 'Business' },
    { value: 'ceremony', label: 'Ceremony' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' }
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

  ensureDate(date) {
    let ret = date
    if (!(date instanceof Date)) {
      const time_ms = Date.parse(date)
      if(isNaN(time_ms)) {
        ret = null
      } else {
        ret = new Date(time_ms)
      }
    }
    return ret
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <FormInput
          label='Title'
          padded={false}
          error={this.props.errors.title}>
          <TextInput
            placeholder='Name'
            value={this.props.listItem.title || ''}
            fill={true}
            onChange={ e => this.props.update('title', e.target.value) } />
        </FormInput>

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

        <FormInput
          label='Host'
          padded={false}
          error={this.props.errors.host}>
          <TextInput
            placeholder='Host'
            value={this.props.listItem.host || ''}
            fill={true}
            onChange={ e => this.props.update('host', e.target.value) } />
        </FormInput>

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
            onClick={() => this.dropzone.open()}>Select Image
          </AnchorButton>
        </div>

        <FormInput
          label='Start Time'
          padded={false}
          error={this.props.errors.start_time}>
          <DateTimeInput
            value={this.ensureDate(this.props.listItem.start_time)}
            onChange={ dt => this.props.update('start_time', dt)} />
        </FormInput>

        <FormInput
          label='End Time'
          padded={false}
          error={this.props.errors.end_time}>
          <DateTimeInput
            value={this.ensureDate(this.props.listItem.end_time)}
            onChange={ dt => this.props.update('end_time', dt)} />
        </FormInput>

        <FormInput
          label='Location'
          padded={false}
          error={this.props.errors.location}>
          <TextInput
            placeholder='Location'
            value={this.props.listItem.location || ''}
            fill={true}
            onChange={ e => this.props.update('location', e.target.value) } />
        </FormInput>

        <FormInput
          label='Address'
          padded={false}
          error={this.props.errors.address}>
          <TextInput
            placeholder='Address'
            value={this.props.listItem.address || ''}
            fill={true}
            onChange={ e => this.props.update('address', e.target.value) } />
        </FormInput>

        <FormInput
          label='Category'
          padded={false}
          error={this.props.errors.category}>
          <SelectInput
            selected={this.props.listItem.category}
            placeholder='Please Select'
            options={CATEGORY_CHOICES}
            onChange={ e => this.props.update('category', e.target.value)} />
        </FormInput>

        <FormInput
          label='Facebook Link'
          padded={false}
          error={this.props.errors.facebook_url}>
          <TextInput
            placeholder='https://www.facebook.com/events/###'
            value={this.props.listItem.facebook_url || ''}
            fill={true}
            onChange={ e => this.props.update('facebook_url', e.target.value) } />
        </FormInput>
      </form>
    )
  }
}
