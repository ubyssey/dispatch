import React from 'react'

import { EditableText, Tooltip, Position, Intent } from '@blueprintjs/core'

require('../../../styles/components/article_headline.scss')

export default function ArticleHeadline(props) {

  function handleUpdate(value) {
    props.onUpdate(props.field || 'headline', value)
  }

  const textField = (
    <EditableText
      multiline={true}
      minLines={1}
      maxLines={4}
      placeholder='Enter a headline'
      value={props.headline || ''}
      onChange={handleUpdate} />
  )

  if (props.error) {
    return (
      <div className='c-article-headline'>
        <Tooltip
          content={props.error}
          position={Position.BOTTOM}
          intent={Intent.DANGER}
          isOpen={true}>
          {textField}
        </Tooltip>
      </div>
    )
  } else {
    return (
      <div className='c-article-headline'>{textField}</div>
    )
  }
}
