import React from 'react'

import {
  TextInput,
  TextAreaInput,
  ImageInput,
  SelectInput
} from '../inputs'

import * as Form from '../Form'

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

const EXPLICIT_OPTIONS = [
  ['No', 'No'],
  ['Yes', 'Yes'],
  ['Clean', 'Clean'],
]

export default function PodcastForm(props) {
  return (
    <Form.Container>

      <Form.Input
        label='Title'
        error={props.errors.title}>
        <TextInput
          placeholder='Title'
          value={props.listItem.title || ''}
          fill={true}
          onChange={e => props.update('title', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Slug'
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.listItem.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Description'
        error={props.errors.description}>
        <TextAreaInput
          placeholder='Description'
          value={props.listItem.description || ''}
          fill={true}
          onChange={e => props.update('description', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Author'
        error={props.errors.author}>
        <TextInput
          placeholder='Author'
          value={props.listItem.author || ''}
          fill={true}
          onChange={e => props.update('author', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Owner Name'
        error={props.errors.owner_name}>
        <TextInput
          placeholder='Owner Name'
          value={props.listItem.owner_name || ''}
          fill={true}
          onChange={e => props.update('owner_name', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Owner Email'
        error={props.errors.owner_email}>
        <TextInput
          placeholder='Owner Email'
          type='email'
          value={props.listItem.owner_email || ''}
          fill={true}
          onChange={e => props.update('owner_email', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Category'>
        <SelectInput
          options={CATEGORY_OPTIONS}
          default={CATEGORY_OPTIONS[0][0]}
          value={props.listItem.category}
          onChange={e => props.update('category', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Explicit'
        padded={false}>
        <SelectInput
          options={EXPLICIT_OPTIONS}
          default={EXPLICIT_OPTIONS[0][0]}
          value={props.listItem.explicit}
          onChange={e => props.update('explicit', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Image'
        error={props.errors.image}>
        <ImageInput
          value={props.listItem.image}
          onChange={imageId => props.update('image', imageId)} />
      </Form.Input>

    </Form.Container>
  )
}
