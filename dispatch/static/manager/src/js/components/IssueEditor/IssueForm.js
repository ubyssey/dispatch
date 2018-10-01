import React from 'react'

import { Position } from '@blueprintjs/core'

import { TextInput, DateTimeInput, FileInput } from '../inputs'

import * as Form from '../Form'

export default function IssueForm(props) {
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
        label='File'
        error={props.errors.file}>
        <FileInput
          placeholder={props.listItem.file_str || 'Choose a file...'}
          value={props.listItem.file || ''}
          fill={true}
          onChange={file => props.update('file', file)} />
      </Form.Input>

      <Form.Input
        label='Cover Image'
        error={props.errors.img}>
        <FileInput
          placeholder={props.listItem.img_str || 'Choose a cover image...'}
          value={props.listItem.img || ''}
          fill={true}
          onChange={file => props.update('img', file)} />
      </Form.Input>

      <Form.Input
        label='Volume Number'
        error={props.errors.volume}>
        <TextInput
          type='number'
          placeholder='Volume Number'
          value={props.listItem.volume || null}
          fill={true}
          onChange={e => props.update('volume', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Issue Number'
        error={props.errors.issue}>
        <TextInput
          type='number'
          placeholder='Issue Number'
          value={props.listItem.issue || null}
          fill={true}
          onChange={e => props.update('issue', e.target.value)} />
      </Form.Input>

      <Form.Input
        label='Date'
        error={props.errors.date}>
        <DateTimeInput
          value={props.listItem.date}
          position={Position.BOTTOM}
          showTimePicker={false}
          onChange={date => props.update('date', date)} />
      </Form.Input>

    </Form.Container>
  )
}
