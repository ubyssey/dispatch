import React from 'react'

import ArticleSelectInput from '../inputs/ArticleSelectInput'

export default function ArticleField(props) {

  return (
    <ArticleSelectInput
      selected={props.data}
      many={props.many}
      update={articleId => props.onChange(articleId)} />
  )

}
