import React from 'react'

import { FormInput, TextInput, TextAreaInput } from './inputs'
import { Label, InputGroup } from '@blueprintjs/core'

import AuthorSelectInput from './AuthorSelectInput.jsx'

export default function ArticleBasicFields(props) {

  return (
    <div>

      <FormInput label='Slug'>
        <TextInput
          placeholder='Slug'
          value={props.slug}
          onChange={ e => props.update('slug', e.target.value) } />
      </FormInput>

      <FormInput label='Authors'>
        <AuthorSelectInput
          authors={props.authors}
          update={ authors => props.update('authors', authors) } />
      </FormInput>

      <FormInput label='Slug'>
        <TextAreaInput
          placeholder='Snippet'
          value={props.snippet}
          rows='5'
          onChange={ e => props.update('snippet', e.target.value) } />
      </FormInput>

    </div>
  )

}
