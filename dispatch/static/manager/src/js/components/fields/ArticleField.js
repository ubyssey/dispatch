import React from 'react'

import ArticleSelectInput from '../inputs/selects/ArticleSelectInput'

export default function ArticleField(props) {
  return (
    <ArticleSelectInput
      value={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}
