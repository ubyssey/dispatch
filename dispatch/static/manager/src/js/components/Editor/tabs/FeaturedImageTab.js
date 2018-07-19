import React from 'react'
import R from 'ramda'

import { FormInput, TextAreaInput, ImageInput } from '../../inputs'

export default function FeaturedImageTab(props) {

  function updateImage(imageId) {
    if (imageId){
      return props.update(
        'featured_image',
        R.merge(props.featured_image, { image: imageId })
      )
    } else {
      return props.update(
        'featured_image',
        null
      )
    }

  }

  function updateCaption(caption) {
    return props.update(
      'featured_image',
      R.merge(props.featured_image, { caption: caption })
    )
  }

  function updateCredit(credit) {
    return props.update(
      'featured_image',
      R.merge(props.featured_image, { credit: credit })
    )
  }

  if (props.featured_image && props.featured_image.image) {

    return (
      <div>
        <FormInput label='Image'>
          <ImageInput
            fill={true}
            removable={true}
            selected={props.featured_image.image}
            onChange={updateImage} />
        </FormInput>

        <FormInput label='Caption'>
          <TextAreaInput
            placeholder='Caption'
            value={props.featured_image.caption || ''}
            rows='2'
            onChange={e => updateCaption(e.target.value)} />
        </FormInput>

        <FormInput label='Credit'>
          <TextAreaInput
            placeholder='Credit'
            value={props.featured_image.credit || ''}
            rows='2'
            onChange={e => updateCredit(e.target.value)} />
        </FormInput>
      </div>
    )
  } else {
    return (
      <div>
        <FormInput label='Image'>
          <ImageInput
            onChange={updateImage} />
        </FormInput>
      </div>
    )
  }

}
