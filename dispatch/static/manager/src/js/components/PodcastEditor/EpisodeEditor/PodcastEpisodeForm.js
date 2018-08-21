import React from 'react'

import {
  FormInput,
  TextInput,
  TextAreaInput,
  ImageInput,
  DateTimeInput,
  FileInput
} from '../../inputs'

export default function PodcastEpisodeForm(props) {
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
        label='Published At'
        padded={false}
        error={props.errors.published_at}>
        <DateTimeInput
          value={props.listItem.published_at}
          onChange={dt => props.update('published_at', dt)} />
      </FormInput>

      <FormInput
        label='Image'
        padded={false}
        error={props.errors.image}>
        <ImageInput
          selected={props.listItem.image}
          onChange={imageId => props.update('image', imageId)} />
      </FormInput>

      <FormInput
        label='Audio File'
        padded={false}
        error={props.errors.file}>
        <FileInput
          placeholder={props.listItem.file_str || 'Choose a file...'}
          value={props.listItem.file || ''}
          fill={true}
          onChange={file => props.update('file', file)} />
      </FormInput>

    </form>
  )
}
