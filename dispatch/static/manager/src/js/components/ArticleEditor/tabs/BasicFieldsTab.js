import React from 'react'

import { FormInput, TextInput, TextAreaInput } from '../../inputs'

import SectionSelectInput from '../../inputs/SectionSelectInput'
import AuthorSelectInput from '../../inputs/AuthorSelectInput'
import TagSelectInput from '../../inputs/TagSelectInput'
import TopicSelectInput from '../../inputs/TopicSelectInput'

export default function BasicFieldsTab(props) {

  return (
    <div>

      <FormInput label='Slug'>
        <TextInput
          placeholder='Slug'
          value={props.slug}
          fill={true}
          onChange={ e => props.update('slug', e.target.value) } />
      </FormInput>

      <FormInput label='Section'>
        <SectionSelectInput
          selected={props.section}
          update={ section => props.update('section', section) } />
      </FormInput>

      <FormInput label='Authors'>
        <AuthorSelectInput
          selected={props.authors}
          update={ authors => props.update('authors', authors) } />
      </FormInput>

      <FormInput label='Tags'>
        <TagSelectInput
          selected={props.tags}
          update={ tags => props.update('tags', tags) } />
      </FormInput>

      <FormInput label='Topic'>
        <TopicSelectInput
          selected={props.topic}
          update={ topic => props.update('topic', topic) } />
      </FormInput>

      <FormInput label='Snippet'>
        <TextAreaInput
          placeholder='Snippet'
          value={props.snippet}
          rows='5'
          onChange={ e => props.update('snippet', e.target.value) } />
      </FormInput>

    </div>
  )

}
