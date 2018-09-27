import React from 'react'

import { TextInput, TextAreaInput } from '../../inputs'

import * as Form from '../../Form'

import SectionSelectInput from '../../inputs/selects/SectionSelectInput'
import AuthorSelectInput from '../../inputs/selects/AuthorSelectInput'
import TagSelectInput from '../../inputs/selects/TagSelectInput'
import TopicSelectInput from '../../inputs/selects/TopicSelectInput'
import SubsectionSelectInput from '../../inputs/selects/SubsectionSelectInput'

export default function BasicFieldsTab(props) {
  return (
    <div className='c-article-sidebar__panel'>

      <Form.Input
        label='Slug'
        error={props.errors.slug}>
        <TextInput
          placeholder='Slug'
          value={props.slug || ''}
          fill={true}
          onChange={e => props.update('slug', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Section'
        error={props.errors.section_id}>
        <SectionSelectInput
          value={props.section}
          update={section => props.update('section', section)} />
      </Form.Input>

      <Form.Input
        label='Authors'
        error={props.errors.author_ids}>
        <AuthorSelectInput
          value={props.authors}
          update={authors => props.update('authors', authors)} />
      </Form.Input>

      <Form.Input
        label='Tags'
        error={props.errors.tag_ids}>
        <TagSelectInput
          value={props.tags}
          update={tags => props.update('tags', tags)} />
      </Form.Input>

      <Form.Input
        label='Topic'
        error={props.errors.topic_ids}>
        <TopicSelectInput
          value={props.topic}
          many={false}
          update={topic => props.update('topic', topic)} />
      </Form.Input>

      <Form.Input
        label='Subsection'
        error={props.errors.subsection}>
        <SubsectionSelectInput
          many={false}
          value={props.subsection}
          update={subsection => props.update('subsection', subsection)} />
      </Form.Input>

      <Form.Input
        label='Snippet'
        error={props.errors.snippet}>
        <TextAreaInput
          placeholder='Snippet'
          value={props.snippet || ''}
          rows='5'
          onChange={e => props.update('snippet', e.target.value)} />
      </Form.Input>

    </div>
  )
}
