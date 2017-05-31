import React from 'react'

import { FormInput, TextInput, TextAreaInput, DateTimeInput,
ImageInput, SelectInput } from '../inputs'

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

function ensureDate(date) {
  let ret = date
  if (!(date instanceof Date)) {
    const time_ms = Date.parse(date)
    if(isNaN(time_ms)) {
      ret = new Date()
    } else {
      ret = new Date(time_ms)
    }
  }
  return ret
}

export default function EventForm(props) {

  return (
    <form onSubmit={e => e.preventDefault()}>
      <FormInput
        label='Title'
        padded={false}
        error={props.errors.title}>
        <TextInput
          placeholder='Name'
          value={props.listItem.title || ''}
          fill={true}
          onChange={ e => props.update('title', e.target.value) } />
      </FormInput>

      <FormInput
        label='Description'
        padded={false}
        error={props.errors.description}>
        <TextAreaInput
          placeholder='Description'
          value={props.listItem.description || ''}
          fill={true}
          onChange={ e => props.update('description', e.target.value) } />
      </FormInput>

      <FormInput
        label='Host'
        padded={false}
        error={props.errors.host}>
        <TextInput
          placeholder='Host'
          value={props.listItem.host || ''}
          fill={true}
          onChange={ e => props.update('host', e.target.value) } />
      </FormInput>

      <FormInput
        label='Featured Image'
        padded={false}
        error={props.errors.image}>
          <ImageInput
            fill={false}
            selected={props.listItem.image}
            onChange={ image => props.update('image', image) } />
      </FormInput>

      <FormInput
        label='Start Time'
        padded={false}
        error={props.errors.start_time}>
        <DateTimeInput
          value={ensureDate(props.listItem.start_time)}
          onChange={ dt => props.update('start_time', dt)} />
      </FormInput>

      <FormInput
        label='End Time'
        padded={false}
        error={props.errors.end_time}>
        <DateTimeInput
          value={ensureDate(props.listItem.end_time)}
          onChange={ dt => props.update('end_time', dt)} />
      </FormInput>

      <FormInput
        label='Location'
        padded={false}
        error={props.errors.location}>
        <TextInput
          placeholder='Location'
          value={props.listItem.location || ''}
          fill={true}
          onChange={ e => props.update('location', e.target.value) } />
      </FormInput>

      <FormInput
        label='Address'
        padded={false}
        error={props.errors.address}>
        <TextInput
          placeholder='Address'
          value={props.listItem.address || ''}
          fill={true}
          onChange={ e => props.update('address', e.target.value) } />
      </FormInput>

      <FormInput
        label='Category'
        padded={false}
        error={props.errors.category}>
        <SelectInput
          selected={props.listItem.category}
          options={CATEGORY_CHOICES}
          onChange={ e => props.update('category', e.target.value)} />
      </FormInput>

      <FormInput
        label='Facebook Link'
        padded={false}
        error={props.errors.facebook_url}>
        <TextInput
          placeholder='https://www.facebook.com/events/###'
          value={props.listItem.facebook_url || ''}
          fill={true}
          onChange={ e => props.update('facebook_url', e.target.value) } />
      </FormInput>
    </form>
  )
}
