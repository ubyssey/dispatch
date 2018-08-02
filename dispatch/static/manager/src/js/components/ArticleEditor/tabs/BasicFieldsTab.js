import React from 'react'

import { FormInput, TextInput, TextAreaInput } from '../../inputs'

import SectionSelectInput from '../../inputs/selects/SectionSelectInput'
import AuthorSelectInput from '../../inputs/selects/AuthorSelectInput'
import TagSelectInput from '../../inputs/selects/TagSelectInput'
import TopicSelectInput from '../../inputs/selects/TopicSelectInput'
import SubsectionSelectInput from '../../inputs/selects/SubsectionSelectInput'

export default function BasicFieldsTab(props) {
  return (
    <div>
      <FormInput
        label='Slug'
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value)} />
      </FormInput>

      <FormInput
        label='Section'
        error={props.errors.section_id}>
        <SectionSelectInput
          selected={props.section}
          update={section => props.update('section', section)} />
      </FormInput>

      <FormInput
        label='Authors'
        error={props.errors.author_ids}>
        <AuthorSelectInput
          selected={props.authors}
          update={authors => props.update('authors', authors)} />
      </FormInput>

      <FormInput
        label='Tags'
        error={props.errors.tag_ids}>
        <TagSelectInput
          selected={props.tags}
          update={tags => props.update('tags', tags)} />
      </FormInput>

      <FormInput
        label='Topic'
        error={props.errors.topic_ids}>
        <TopicSelectInput
          selected={props.topic}
          update={topic => props.update('topic', topic)} />
      </FormInput>

      <FormInput
        label='Subsection'
        error={props.errors.subsection}>
        <SubsectionSelectInput
          many={false}
          selected={props.subsection}
          update={subsection => props.update('subsection', subsection)} />
      </FormInput>

      <FormInput
        label='Snippet'
        error={props.errors.snippet}>
        <TextAreaInput
          placeholder='Snippet'
          value={props.snippet || ''}
          rows='5'
          onChange={e => props.update('snippet', e.target.value)} />
      </FormInput>

    </div>
  )
}
