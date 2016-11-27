import React from 'react'

import { Label, InputGroup } from '@blueprintjs/core'

export default function ArticleBasicFields(props) {

  return (
    <div>
      <label className='pt-label'>
        Slug
        <input
          className='pt-input pt-fill'
          type='text'
          placeholder='Slug'
          value={props.slug}
          onChange={ e => props.update('slug', e.target.value) } />
      </label>

      <label className='pt-label'>
        Section
        <InputGroup placeholder='Section' />
      </label>

      <label className='pt-label'>
        Snippet
        <textarea
          className='pt-input pt-fill'
          placeholder='Snippet'
          value={props.snippet}
          rows='5'
          onChange={ e => props.update('snippet', e.target.value) } />
      </label>
    </div>
  )

}
