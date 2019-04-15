import React from 'react'

import { articleSchema } from '../../constants/Schemas'

import ArticleSelectInput from '../inputs/selects/ArticleSelectInput'

function ArticleField(props) {
  return (
    <ArticleSelectInput
      value={props.data}
      many={props.field.many}
      onChange={selected => props.onChange(selected)} />
  )
}

ArticleField.type = 'article'
ArticleField.schema = articleSchema

export default ArticleField