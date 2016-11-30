import React from 'react'

import { EditableText } from '@blueprintjs/core'

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
