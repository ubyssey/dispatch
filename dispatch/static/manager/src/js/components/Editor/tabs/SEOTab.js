import React from 'react'

import { TextInput, TextAreaInput } from '../../inputs'

import * as Form from '../../Form'

function containsKeyword(field, keyword, divider) {
  if (field && keyword) {
    var splitField = field.toLowerCase().split(divider)
    var splitKeyword  = keyword.toLowerCase().split(' ')

    for (var l = 0; l < splitKeyword.length; l++ ) {
      for (var i = 0; i < splitField.length; i++) {
        if (splitField[i] === splitKeyword[l] ) {
          return true
        }
      }
    }
  }

  return false
}

function ConfirmationTag(props) {
  let intent = props.confirmed ? 'success' : 'danger'

  return (
    <div className={`bp3-tag bp3-minimal bp3-intent-${intent}`}>{props.label}</div>
  )
}

function CharacterCount(props) {
  let intent

  if (props.count <= props.min - props.margin || props.count >= props.max + props.margin) {
    intent = 'danger'
  } else if (props.count >= props.min && props.count <= props.max) {
    intent = 'success'
  } else if (
    (props.count > props.max && props.count < props.max + props.margin) ||
    (props.count > props.min - props.margin && props.count < props.min)
  ) {
    intent = 'warning'
  }

  return (
    <div className={`bp3-tag bp3-minimal bp3-intent-${intent}`}>
      {`Characters: ${props.count}/${props.max}`}
    </div>
  )
}

export default function SEOTab(props) {

  return (
    <div className='c-article-sidebar__panel'>

      <Form.Input label='Focus Keywords'>
        <TextInput
          placeholder='Focus Keywords'
          value={props.seo_keyword}
          fill={true}
          onChange={e => props.update('seo_keyword', e.target.value)} />

        <div className='c-article-sidebar__confirmation'>
          <ConfirmationTag
            label='Headline'
            confirmed={containsKeyword(props.headline, props.seo_keyword, ' ')} />
          <ConfirmationTag
            label='Slug'
            confirmed={containsKeyword(props.slug, props.seo_keyword, '-')} />
        </div>

      </Form.Input>

      <Form.Input label='Meta Description'>
        <TextAreaInput
          placeholder='Meta Description'
          value={props.seo_description}
          rows='5'
          onChange={e => props.update('seo_description', e.target.value)} />
        <div className='c-article-sidebar__confirmation'>
          <CharacterCount
            count={props.seo_description.length}
            min={130}
            max={160}
            margin={10} />
        </div>
      </Form.Input>

    </div>
  )

}
