import React from 'react'
import { FormInput, DateTimeInput } from '../inputs'
import ArticleSelectInput from '../inputs/selects/ArticleSelectInput'

export default function NotificationForm(props) {

  return (
    <form onSubmit={e => e.preventDefault()}>
      <FormInput
        label='Article'
        padded={false}>
        <ArticleSelectInput
          selected={props.listItem.article_id}
          many={false}
          onChange={selected => props.update('article_id', selected)} />
      </FormInput>

      <FormInput
        label='Scheduled push time'
        padded={false}
        error={props.errors.scheduled_push_time}>
        <DateTimeInput
          value={props.listItem.scheduled_push_time}
          onChange={dt => props.update('scheduled_push_time', dt)} />
      </FormInput>
    </form>
  )
}
