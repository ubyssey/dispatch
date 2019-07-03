import React from 'react'

import { Button, Intent } from '@blueprintjs/core'

import { TextInput } from '../../inputs'
import AuthorSelectInput from '../../inputs/selects/AuthorSelectInput'
import TagSelectInput from '../../inputs/selects/TagSelectInput'

import * as Form from '../../Form'

require('../../../../styles/components/image_panel.scss')

export default function ImagePanel(props) {
  return (
    !props.shouldHide && <div className='c-image-panel'>
      <div className='c-image-panel__header'>
        <Button
          intent={Intent.SUCCESS}
          onClick={() => props.save()}>Update</Button>
        <Button
          intent={Intent.DANGER}
          onClick={() => props.delete()}>Delete</Button>
      </div>
      <div className='c-image-panel__image'>
        <img className='c-image-panel__image__img' src={props.image.url_medium? props.image.url_medium : props.image.img.preview} />
        <div className='c-image-panel__image__filename'>{props.image.filename? props.image.filename: props.image.img.name}</div>
      </div>
      <form className='c-image-panel__form'>
        <Form.Input label='Title'>
          <TextInput
            value={props.image.title || ''}
            onChange={e => props.update('title', e.target.value)}
            fill={true} />
        </Form.Input>
        <Form.Input label='Photographers'>
          <AuthorSelectInput
            value={props.image.authors}
            update={authors => props.update('authors', authors)}
            defaultAuthorType={AuthorSelectInput.PHOTOGRAPHER} />
        </Form.Input>
        <Form.Input label='Tags'>
          <TagSelectInput
            value={props.image.tags}
            update={tags => props.update('tags', tags)} />
        </Form.Input>
      </form>
    </div>
  )
}
