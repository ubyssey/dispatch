import React from 'react'
import R from 'ramda'

import { FormInput, TextInput, MultiSelectInput } from '../inputs'

export default function ImagePanel(props) {

  function updateAuthors(authors) {
    let authorEntities = authors.map(id => {
      return props.persons.entities[id]
    })
    let newImage = R.merge(props.image, { authors: authorEntities })
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
            selected={props.image.authors}
            results={props.persons.results}
            entities={props.persons.entities}
            fetchResults={props.fetchPersons}
            attribute='full_name'
            onUpdate={updateAuthors} />
        </FormInput>
      </form>
    </div>
  )
}
