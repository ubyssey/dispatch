import React from 'react'

import ArticleSelectInput from '../inputs/ArticleSelectInput'

export default function ArticleField(props) {

  return (
    <ArticleSelectInput
      selected={props.data || []}
      update={articleId => props.onChange(articleId)} />
  )

}
