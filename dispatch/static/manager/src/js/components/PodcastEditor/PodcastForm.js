import React from 'react'

import {
  FormInput,
  TextInput,
  TextAreaInput,
  ImageInput,
  SelectInput
} from '../inputs'

import FormContainer from '../../containers/FormContainer'

const CATEGORY_OPTIONS = [
    ['Arts', 'Arts'],
    ['Business', 'Business'],
    ['Comedy', 'Comedy'],
    ['Education', 'Education'],
    ['Games &amp; Hobbies', 'Games & Hobbies'],
    ['Government &amp; Organizations', 'Government & Organizations'],
    ['Health', 'Health'],
    ['Kids &amp; Family', 'Kids & Family'],
    ['Music', 'Music'],
    ['News &amp; Politics', 'News & Politics'],
    ['Religion &amp; Spirituality', 'Religion & Spirituality'],
    ['Science &amp; Medicine', 'Science & Medicine'],
    ['Society &amp; Culture', 'Society & Culture'],
    ['Sports &amp; Recreation', 'Sports & Recreation'],
    ['Technology', 'Technology'],
    ['TV &amp; Film', 'TV & Film'],
]

export default function PodcastForm(props) {
  return (
    <FormContainer>

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
        label='Owner Name'
        padded={false}
        error={props.errors.owner_name}>
        <TextInput
          placeholder='Owner Name'
          value={props.listItem.owner_name || ''}
          fill={true}
          onChange={e => props.update('owner_name', e.target.value)} />
      </FormInput>

      <FormInput
        label='Owner Email'
        padded={false}
        error={props.errors.owner_email}>
        <TextInput
          placeholder='Owner Email'
          type='email'
          value={props.listItem.owner_email || ''}
          fill={true}
          onChange={e => props.update('owner_email', e.target.value)} />
      </FormInput>

      <FormInput
        label='Category'
        padded={false}>
        <SelectInput
          options={CATEGORY_OPTIONS}
          default={CATEGORY_OPTIONS[9][0]}
          value={props.listItem.category}
          onChange={e => props.update('category', e.target.value)} />
      </FormInput>

      <FormInput
        label='Image'
        padded={false}
        error={props.errors.image}>
        <ImageInput
          value={props.listItem.image}
          onChange={imageId => props.update('image', imageId)} />
      </FormInput>

    </FormContainer>
  )
}
