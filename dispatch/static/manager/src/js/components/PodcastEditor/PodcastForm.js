import React from 'react'

import {
  FormInput,
  TextInput,
  TextAreaInput,
  ImageInput
} from '../inputs'

export default function PodcastForm(props) {
  return (
    <form>
      <FormInput
        label='Title'
        padded={false}
        error={props.errors.title}>
        <TextInput
          placeholder='Title'
          value={props.listItem.title || ''}
          fill={true}
          onChange={e => props.update('title', e.target.value)} />
      </FormInput>

      <FormInput
        label='Slug'
        padded={false}
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.listItem.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value)} />
      </FormInput>

      <FormInput
        label='Description'
        padded={false}
        error={props.errors.description}>
        <TextAreaInput
          placeholder='Description'
          value={props.listItem.description || ''}
          fill={true}
          onChange={e => props.update('description', e.target.value)} />
      </FormInput>

      <FormInput
        label='Author'
        padded={false}
        error={props.errors.author}>
        <TextInput
          placeholder='Author'
          value={props.listItem.author || ''}
          fill={true}
          onChange={e => props.update('author', e.target.value)} />
      </FormInput>

      <FormInput
        label='Category'
        padded={false}
        error={props.errors.category}>
        <TextInput
          placeholder='Category'
          value={props.listItem.category || ''}
          fill={true}
          onChange={e => props.update('category', e.target.value)} />
      </FormInput>


      <FormInput
        label='Image'
        padded={false}
        error={props.errors.image}>
        <ImageInput
          selected={props.listItem.image}
          onChange={imageId => props.update('image', imageId)} />
      </FormInput>

    </form>
  )
}
