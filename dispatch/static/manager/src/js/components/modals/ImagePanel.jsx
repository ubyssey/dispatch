import React from 'react'
import R from 'ramda'

import { FormInput, TextInput, MultiSelectInput } from '../inputs'

export default function ImagePanel(props) {

  function updateAuthors(authors) {
    let newImage = R.merge(props.image, { authors: authors })
    props.updateImage(props.image.id, newImage)
  }

  return (
    <div className='c-image-panel'>
      <img className='c-image-panel__image' src={props.image.thumb} />
      <div className='c-image-panel__filename'>{props.image.filename}</div>
      <form>
        <FormInput label='Title'>
          <TextInput />
        </FormInput>
        <FormInput label='Photographers'>
          <MultiSelectInput
            values={props.image.authors}
            results={props.persons}
            fetchResults={props.fetchPersons}
            attribute='full_name'
            onUpdate={updateAuthors} />
        </FormInput>
      </form>
    </div>
  )
}
