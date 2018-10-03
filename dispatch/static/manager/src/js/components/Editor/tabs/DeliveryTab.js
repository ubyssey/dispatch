import React from 'react'
import R from 'ramda'

import { Switch } from '@blueprintjs/core'
import {  SelectInput, LinkButton, DateTimeInput } from '../../inputs'

import * as Form from '../../Form'

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

export default function DeliveryTab(props) {
  const isInstantArticlesEnabled = props.availableIntegrations['fb-instant-articles'] && props.availableIntegrations['fb-instant-articles'].settings.page_configured

  let warningMessage = null

  if (!isInstantArticlesEnabled) {
    warningMessage = (
      <div className='u-flex bp3-callout bp3-intent-danger'>
        <div className='u-flex--fill u-flex--align-middle'>Please enable Facebook Instant Articles to use this feature</div>
        <div><LinkButton to='integrations/fb-instant-articles'>Enable</LinkButton></div>
      </div>
    )
  }

  const timeoutPicker = props.is_breaking ?
    <div>
      <p>Timeout</p>
      <DateTimeInput
        hidden={!props.is_breaking}
        value={props.breaking_timeout}
        onChange={dt => props.update('breaking_timeout', dt)} />
    </div> : null


  return (
    <div className='c-article-sidebar__panel'>

      <Form.Input label='Importance'>
        <SelectInput
          options={IMPORTANCE_OPTIONS}
          value={props.importance}
          onChange={e => props.update('importance', e.target.value)} />
      </Form.Input>

      <Form.Input label='Reading Time'>
        <SelectInput
          options={READING_TIME_OPTIONS}
          value={props.reading_time}
          onChange={e => props.update('reading_time', e.target.value)} />
      </Form.Input>

      <Form.Input label='Enable as Facebook Instant Article'>
        <Switch
          className='bp3-large'
          disabled={!isInstantArticlesEnabled}
          checked={R.path(['fb-instant-articles', 'enabled'], props.integrations)}
          onChange={e => updateInstantArticle(props.update, props.integrations, e.target.checked)} />
        {warningMessage}
      </Form.Input>

      <Form.Input label='Breaking news'>
        <Switch
          className='bp3-large'
          checked={props.is_breaking}
          onChange={e => props.update('is_breaking', e.target.checked)} />
          {timeoutPicker}
      </Form.Input>

    </div>
  )

}
