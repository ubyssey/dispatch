import React from 'react'

import { EditableText } from '@blueprintjs/core'

require('../../../styles/components/article_headline.scss')

export default function ArticleHeadline(props) {

  function handleUpdate(value) {
    props.onUpdate('headline', value)
  }

  return (
    <div className='c-article-headline'>
      <EditableText
        multiline={true}
        minLines={1}
        maxLines={4}
        placeholder='Enter a headline'
        value={props.headline}
        onChange={handleUpdate} />
    </div>
  )
}
