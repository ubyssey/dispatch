import React from 'react'
import { Switch } from '@blueprintjs/core'

import { FormInput, TextInput, TextAreaInput } from '../inputs'

import SectionSelectInput from '../inputs/selects/SectionSelectInput'
import AuthorSelectInput from '../inputs/selects/AuthorSelectInput'
import ArticleSelectInput from '../inputs/selects/ArticleSelectInput'
export default function SubsectionForm(props) {

  const articles = !props.listItem.articles ? [] : props.listItem.articles
    .map(article => article.id)

  function updateArticles(article_ids) {
    const articles = article_ids.map(id => ({
      id: id
    }))
    props.update('articles', articles)
  }

  function updateSection(section_id) {
    const section = {
      id: section_id
    }
    props.update('section', section)
  }

  return (
    <form>

      <FormInput
        label='Name'
        padded={false}
        error={props.errors.name}>
        <TextInput
          placeholder='Name'
          value={props.listItem.name || ''}
          fill={true}
          onChange={e => props.update('name', e.target.value)} />
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
        label='Is Active'
        padded={false}
        error={props.errors.is_active} >
        <Switch
          className='pt-large'
          checked={props.listItem.is_active}
          onChange={e => props.update('is_active', e.target.checked)} />
      </FormInput>

      <FormInput
        label='Section'
        padded={false}
        error={props.errors.section_id}>
        <SectionSelectInput
          selected={props.listItem.section ? props.listItem.section.id : null}
          update={section => updateSection(section)} />
      </FormInput>

      <FormInput
        label='Authors'
        padded={false}
        error={props.errors.author_ids}>
        <AuthorSelectInput
          selected={props.listItem.authors || []}
          update={authors => props.update('authors', authors)} />
      </FormInput>

      <FormInput
        label='Articles'
        padded={false}
        error={props.errors.article_ids}>
        <ArticleSelectInput
          selected={articles}
          many={true}
          onChange={(articles) => updateArticles(articles)} />
      </FormInput>

      <FormInput
        label='Description'
        error={props.errors.snippet}
        padded={false}>
        <TextAreaInput
          placeholder='Description'
          value={props.listItem.description || ''}
          rows='5'
          onChange={e => props.update('description', e.target.value)} />
      </FormInput>

    </form>
  )
}
