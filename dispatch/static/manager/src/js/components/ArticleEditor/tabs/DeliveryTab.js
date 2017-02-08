import React from 'react'

import { FormInput, SelectInput } from '../../inputs'
import { Checkbox } from '@blueprintjs/core'

const IMPORTANCE_OPTIONS = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 }
]

const READING_TIME_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'midday', label: 'Midday' },
  { value: 'evening', label: 'Evening' }
]

const INSTANT_ARTICLE_OPTIONS = [
  { value: true, label: "Yes"},
  { value: false, label: "No"}
]

export default function DeliveryTab(props) {

  return (
    <div>

      <FormInput label='Importance'>
        <SelectInput
          options={IMPORTANCE_OPTIONS}
          selected={props.importance}
          onChange={ e => props.update('importance', e.target.value) } />
      </FormInput>

      <FormInput label='Reading Time'>
        <SelectInput
          options={READING_TIME_OPTIONS}
          selected={props.reading_time}
          onChange={ e => props.update('reading_time', e.target.value) } />
      </FormInput>

      <FormInput label='Enable as Facebook Instant Article'>
        <Checkbox
          checked={props.is_instant_article}
          onChange={ e => props.update('is_instant_article', e.target.checked) } />
      </FormInput>

    </div>
  )

}
