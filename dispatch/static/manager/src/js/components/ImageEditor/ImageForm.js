import React from 'react'

import { FormInput, TextInput } from '../inputs'
import AuthorSelectInput from '../inputs/selects/AuthorSelectInput'

require('../../../styles/components/person_form.scss')
require('../../../styles/components/image_panel.scss')

export default class ImageForm extends React.Component {
  listImages(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listImages(this.props.token, queryObj)
  }
  constructor(props) {
    super(props)

    this.state = {
      displayImg: null
    }
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <FormInput
          label='Title'
          padded={false}>
          <TextInput
            placeholder='Image title'
            value={this.props.listItem.title || ''}
            fill={true}
            onChange={ e => this.props.update('title', e.target.value) } />
        </FormInput>
        <FormInput 
          label='Photographers'
          padded={false}>
          <AuthorSelectInput
            selected={this.props.listItem.authors}
            update={authors => this.props.update('authors', authors)}
            defaultAuthorType={AuthorSelectInput.PHOTOGRAPHER} />
        </FormInput>
        <div className='c-image-panel-image-page'>
          <div className='c-image-panel__image'>
            <img className='c-image-panel__image__img' src={this.props.listItem.url_medium} />
            <div className='c-image-panel__image__filename'>{this.props.listItem.filename}</div>
          </div>
        </div>
        {this.props.errors.detail ?
          <div className='pt-callout pt-intent-danger c-person-form__image__error'>
            {this.props.errors.detail}
          </div> : null}
      </form>
    )
  }
}
