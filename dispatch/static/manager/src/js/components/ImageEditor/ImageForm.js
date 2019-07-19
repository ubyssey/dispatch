import React from 'react'

import { TextInput } from '../inputs'
import AuthorSelectInput from '../inputs/selects/AuthorSelectInput'
import TagSelectInput from '../inputs/selects/TagSelectInput'

import * as Form from '../Form'

require('../../../styles/components/person_form.scss')
require('../../../styles/components/image_panel.scss')

export default class ImageForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      displayImg: null
    }
  }

  listImages(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listImages(this.props.token, queryObj)
  }

  render() {
    return (
      <Form.Container>

        <Form.Input label='Title'>
          <TextInput
            placeholder='Image title'
            value={this.props.listItem.title || ''}
            fill={true}
            onChange={e => this.props.update('title', e.target.value)} />
        </Form.Input>

        <Form.Input label='Photographers'>
          <AuthorSelectInput
            value={this.props.listItem.authors}
            update={authors => this.props.update('authors', authors)}
            authorErrors={this.props.authorErrors}
            defaultAuthorType={AuthorSelectInput.PHOTOGRAPHER} />
        </Form.Input>

        <Form.Input
          label='Tags'
          error={this.props.errors.tag_ids}>
          <TagSelectInput
            value={this.props.listItem.tags}
            update={tags => this.props.update('tags', tags)} />
        </Form.Input>

        <div className='c-image-panel-image-page'>
          <div className='c-image-panel__image'>
            <img className='c-image-panel__image__img' src={this.props.listItem.url_medium} />
            <div className='c-image-panel__image__filename'>{this.props.listItem.filename}</div>
          </div>
        </div>

        {this.props.errors.detail ?
          <div className='bp3-callout bp3-intent-danger c-person-form__image__error'>
            {this.props.errors.detail}
          </div> : null}
          
      </Form.Container>
    )
  }
}
