import React from 'react'
import R from 'ramda'

import { FormInput, TextInput, MultiSelectInput } from '../inputs'

export default function ImagePanel(props) {

  function addAuthor(id) {
    props.addAuthor(props.image, id)
  }

  function removeAuthor(id) {
    props.removeAuthor(props.image, id)
  }

  function createAuthor(fullName) {
    props.createAuthor(props.image, fullName)
  }

  function updateTitle(title) {
    let newImage = R.assoc('title', title, props.image)
    props.updateImage(newImage)
  }

  function save() {
    props.saveImage(props.image)
  }

  return (
    <div className='c-image-panel'>
      <img className='c-image-panel__image' src={props.image.thumb} />
      <div className='c-image-panel__filename'>{props.image.filename}</div>
      <form>
        <FormInput label='Title'>
          <TextInput
            value={props.image.title || ''}
            onChange={e => updateTitle(e.target.value)}
            onDelayedSave={save}
            saveDelay={500} />
        </FormInput>
        <FormInput label='Photographers'>
          <MultiSelectInput
            selected={props.image.authors}
            results={props.persons.results}
            entities={props.persons.entities}
            addValue={addAuthor}
            removeValue={removeAuthor}
            createValue={createAuthor}
            fetchResults={props.fetchPersons}
            attribute='full_name' />
        </FormInput>
      </form>
    </div>
  )
}
