import React from 'react'

import { TextInput, DateTimeInput } from '../inputs'
import AuthorSelectInput from '../inputs/selects/AuthorSelectInput'
import TagSelectInput from '../inputs/selects/TagSelectInput'

import * as Form from '../Form'

export default function VideoForm(props) {
  let youtubeRegex = /(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([A-Za-z0-9\-=_]{11})/;
  let match = '';
  let youtubeVideoID = '';
  if(props.listItem.url != undefined) {
    match = props.listItem.url.match(youtubeRegex);
    youtubeVideoID = match[match.length - 1];
  }
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
        error={props.errors.author_ids}>
        <AuthorSelectInput
          value={props.listItem.authors ? props.listItem.authors: []}
          update={authors => props.update('authors', authors)} 
          authorErrors={props.authorErrors}
          defaultAuthorType={AuthorSelectInput.VIDEOGRAPHER} />
      </Form.Input>

      <Form.Input
        label='Tags'
        error={props.errors.tag_ids}>
        <TagSelectInput
          value={props.listItem.tags ? props.listItem.tags: []}
          update={tags => props.update('tags', tags)} />
      </Form.Input>

      <Form.Input
        label='Created at'
        error={props.errors.created_at}>
        <DateTimeInput
          value={props.listItem.created_at}
          onChange={dt => props.update('created_at', dt)} />
      </Form.Input>
      
      {props.listItem.url && 
        <div className='c-image-panel-image-page'>
          <div className='c-image-panel__image'>
            <img className='c-image-panel__image__img' src={`https://img.youtube.com/vi/${youtubeVideoID}/0.jpg`} />
          </div>
        </div>
      }


    </Form.Container>
  )
}
