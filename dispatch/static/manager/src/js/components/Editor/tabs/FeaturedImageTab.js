import React from 'react'
import R from 'ramda'

import { TextAreaInput, ImageInput } from '../../inputs'

import * as Form from '../../Form'

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
      <div className='c-article-sidebar__panel'>

        <Form.Input label='Image'>
          <ImageInput
            fill={true}
            removable={true}
            value={props.featured_image.image}
            onChange={updateImage} />
        </Form.Input>

        <Form.Input label='Caption'>
          <TextAreaInput
            placeholder='Caption'
            value={props.featured_image.caption || ''}
            rows='2'
            onChange={e => updateCaption(e.target.value)} />
        </Form.Input>

        <Form.Input label='Credit'>
          <TextAreaInput
            placeholder='Credit'
            value={props.featured_image.credit || ''}
            rows='2'
            onChange={e => updateCredit(e.target.value)} />
        </Form.Input>

      </div>
    )
  } else {
    return (
      <div className='c-article-sidebar__panel'>
        <Form.Input label='Image'>
          <ImageInput
            onChange={updateImage} />
        </Form.Input>
      </div>
    )
  }

}
