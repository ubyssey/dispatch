import React from 'react'

import ImageManager from '../../modals/ImageManager'

import { FormInput, TextInput } from '../../inputs'

require('../../../../styles/components/embeds/image.scss')

function ImageEmbedComponent(props) {

  return (
    <div className='o-embed o-embed--image'>
      <img className='o-embed--image__image' src={props.data.url} />
      <form>
        <FormInput label='Caption'>
          <TextInput
            fill={true}
            value={props.data.caption}
            onChange={e => props.updateField('caption', e.target.value)} />
        </FormInput>
        <FormInput label='Custom Credit'>
          <TextInput
            fill={true}
            value={props.data.credit || ''}
            onChange={e => props.updateField('credit', e.target.value)} />
        </FormInput>
      </form>
    </div>
  )

}

export default {
  type: 'image',
  component: ImageEmbedComponent,
  defaultData: {
    image_id: null,
    attachmend_id: null,
    caption: '',
    credit: '',
    url: null
  },
  modal: ImageManager,
  modalCallback: (image) => {
    return {
      image_id: image.id,
      url: image.url
    }
  },
  showEdit: true
}
