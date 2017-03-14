import React from 'react'
import R from 'ramda'

import { FormInput, SelectInput, LinkButton } from '../../inputs'
import { Switch } from '@blueprintjs/core'

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

function updateInstantArticle(update, integrations, enabled) {

  integrations = R.merge(
    integrations,
    {
      'fb-instant-articles': R.merge(
        integrations['fb-instant-articles'],
        {
          enabled: enabled
        }
      )
    }
  )

  return update('integrations', integrations)

}

export default function DeliveryTab(props) {
  const isInstantArticlesEnabled = props.availableIntegrations['fb-instant-articles'] && props.availableIntegrations['fb-instant-articles'].settings.page_configured

  let warningMessage = null;

  if (!isInstantArticlesEnabled) {
    warningMessage = (
      <div className='u-flex pt-callout pt-intent-danger'>
        <div className='u-flex--fill u-flex--align-middle'>Please enable Facebook Instant Articles to use this feature</div>
        <div><LinkButton to='integrations/fb-instant-articles'>Enable</LinkButton></div>
      </div>
    )
  }

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
        <Switch
          className='pt-large'
          disabled={!isInstantArticlesEnabled}
          checked={R.path(['fb-instant-articles', 'enabled'], props.integrations)}
          onChange={ e => updateInstantArticle(props.update, props.integrations, e.target.checked) } />
        {warningMessage}
      </FormInput>

    </div>
  )

}
