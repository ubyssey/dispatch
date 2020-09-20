import React from 'react'
import { Switch } from '@blueprintjs/core'

import { TextInput, TextAreaInput, DateTimeInput } from '../inputs'

import * as Form from '../Form'

import SectionSelectInput from '../inputs/selects/SectionSelectInput'
import AuthorSelectInput from '../inputs/selects/AuthorSelectInput'
import ArticleSelectInput from '../inputs/selects/ArticleSelectInput'

export default function SubsectionForm(props) {

  function updateArticles(articleIds) {
    const articles = articleIds.map(id => ({
      id: id
    }))
    props.update('articles', articles)
  }

  function updateSection(sectionId) {
    const section = {
      id: sectionId
    }
    props.update('section', section)
  }

  const articles = !props.listItem.articles ?
    [] : props.listItem.articles.map(article => article.id)
  
  const timeoutPicker = props.listItem.subsection_banner_message ?
    <div>
      <p>URL</p>
      <TextAreaInput
          placeholder='Enter URL Here'
          value={props.listItem.banner_url || ''}
          rows='1'
          onChange={e => props.update('banner_url', e.target.value)} />
      <p>Timeout</p>
      <DateTimeInput
        hidden={!props.listItem.subsection_banner_message}
        value={props.listItem.banner_timeout}
        onChange={dt => props.update('banner_timeout', dt)} />
    </div> : null

  return (
    <Form.Container>

      <Form.Input
        label='Name'
        error={props.errors.name}>
        <TextInput
          placeholder='Name'
          value={props.listItem.name || ''}
          fill={true}
          onChange={e => props.update('name', e.target.value)} />
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
        label='Is Active'
        error={props.errors.is_active} >
        <Switch
          className='bp3-large'
          checked={props.listItem.is_active}
          onChange={e => props.update('is_active', e.target.checked)} />
      </Form.Input>

      <Form.Input
        label='Section'
        error={props.errors.section_id}>
        <SectionSelectInput
          value={props.listItem.section ? props.listItem.section.id : null}
          update={section => updateSection(section)} />
      </Form.Input>

      <Form.Input
        label='Authors'
        error={props.errors.author_ids}>
        <AuthorSelectInput
          value={props.listItem.authors || []}
          authorErrors={props.authorErrors}
          update={authors => props.update('authors', authors)} />
      </Form.Input>

      <Form.Input
        label='Articles'
        error={props.errors.article_ids}>
        <ArticleSelectInput
          value={articles}
          many={true}
          onChange={articles => updateArticles(articles)} />
      </Form.Input>

      <Form.Input
        label='Description'
        error={props.errors.snippet}>
        <TextAreaInput
          placeholder='Description'
          value={props.listItem.description || ''}
          rows='3'
          onChange={e => props.update('description', e.target.value)} />
      </Form.Input>

      <Form.Input label='Subsection Banner Message'>
        <TextAreaInput
          placeholder='Banner Message'
          value={props.listItem.subsection_banner_message || ''}
          rows='3'
          onChange={e => props.update('subsection_banner_message', e.target.value)} />
          {timeoutPicker}
      </Form.Input>

    </Form.Container>
  )
}
