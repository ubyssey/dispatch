import React from 'react'

import { TextInput } from '../inputs'
import AuthorSelectInput from '../inputs/selects/AuthorSelectInput'
import TagSelectInput from '../inputs/selects/TagSelectInput'

import * as Form from '../Form'

export default function VideoForm(props) {

  return (
    <Form.Container>

      <Form.Input
        label='Title'
        error={props.errors.title}>
        <TextInput
          placeholder='Title'
          value={props.listItem.title || ''}
          fill={true}
          onChange={e => props.update('title', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='URL'
        error={props.errors.url}>
        <TextInput
          placeholder='URL'
          value={props.listItem.url || ''}
          fill={true}
          onChange={e => props.update('url', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Authors'
        error={props.errors.authors}>
        <AuthorSelectInput
          value={props.listItem.authors ? props.listItem.authors: []}
          update={authors => props.update('authors', authors)} 
          defaultAuthorType={AuthorSelectInput.VIDEOGRAPHER} />
      </Form.Input>

      <Form.Input
        label='Tags'
        error={props.errors.tags}>
        {/* <TagSelectInput
          value={props.listItem.tags ? props.listItem.tags: []}
          update={tags => props.update('tags', tags)} /> */}
      </Form.Input>
        
      {props.listItem.url && 
        <div className='c-image-panel-image-page'>
          <div className='c-image-panel__image'>
            <img className='c-image-panel__image__img' src={`http://img.youtube.com/vi/${props.listItem.url.split("v=")[1]}/0.jpg`} />
          </div>
        </div>
      }


    </Form.Container>
  )
}
