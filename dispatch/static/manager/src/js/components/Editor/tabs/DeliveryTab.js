import React from 'react'
import R from 'ramda'
import { dateObjToAPIString } from '../../../util/helpers'

import { FormInput, SelectInput, LinkButton, DateTimeInput } from '../../inputs'
import { Switch } from '@blueprintjs/core'

const IMPORTANCE_OPTIONS = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5]
]

const READING_TIME_OPTIONS = [
  ['morning', 'Morning'],
  ['midday', 'Midday'],
  ['evening', 'Evening']
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

function updateScheduledNotification(update, dt) {
  return update('scheduled_notification', dateObjToAPIString(dt))
}

export default function DeliveryTab(props) {
  const isInstantArticlesEnabled = props.availableIntegrations['fb-instant-articles'] && props.availableIntegrations['fb-instant-articles'].settings.page_configured

  let warningMessage = null

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
          onChange={e => props.update('importance', e.target.value)} />
      </FormInput>

      <FormInput label='Reading Time'>
        <SelectInput
          options={READING_TIME_OPTIONS}
          selected={props.reading_time}
          onChange={e => props.update('reading_time', e.target.value)} />
      </FormInput>

      <FormInput label='Enable as Facebook Instant Article'>
        <Switch
          className='pt-large'
          disabled={!isInstantArticlesEnabled}
          checked={R.path(['fb-instant-articles', 'enabled'], props.integrations)}
          onChange={e => updateInstantArticle(props.update, props.integrations, e.target.checked)} />
        {warningMessage}
      </FormInput>

      <FormInput label='Schedule Notification'>
        <DateTimeInput
          value={props.scheduled_notification}
          onChange={dt => updateScheduledNotification(props.update, dt)} />
      </FormInput>

    </div>
  )

}
