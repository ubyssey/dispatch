import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import { FormInput, TextInput } from '../../inputs'
import AuthorSelectInput from '../../inputs/selects/AuthorSelectInput'
import TagSelectInput from '../../inputs/selects/TagSelectInput'

require('../../../../styles/components/image_panel.scss')

export default function ImagePanel(props) {
  return (
    <div className='c-image-panel'>
      <div className='c-image-panel__header'>
        <AnchorButton
          intent={Intent.SUCCESS}
          onClick={() => props.save()}>Update</AnchorButton>
        <AnchorButton
          intent={Intent.DANGER}
          onClick={() => props.delete()}>Delete</AnchorButton>
      </div>
      <div className='c-image-panel__image'>
        <img className='c-image-panel__image__img' src={props.image.url_medium} />
        <div className='c-image-panel__image__filename'>{props.image.filename}</div>
      </div>
      <form>
        <FormInput label='Title'>
          <TextInput
            value={props.image.title || ''}
            onChange={e => props.update('title', e.target.value)}
            fill={true} />
        </FormInput>
        <FormInput label='Photographers'>
          <AuthorSelectInput
            selected={props.image.authors}
            update={authors => props.update('authors', authors)}
            defaultAuthorType={AuthorSelectInput.PHOTOGRAPHER} />
        </FormInput>
        <FormInput label='Tags'>
          <TagSelectInput
            selected={props.image.tags}
            update={tags => props.update('tags', tags) } />
        </FormInput>
      </form>
    </div>
  )
}
