import React from 'react'
import Textarea from 'react-textarea-autosize'

export default function ArticleHeadline(props) {
  return (
    <div className='c-article-headline'>
      <Textarea className='o-input o-input--headline' rows={1} placeholder='Enter a headline' value={props.headline} onChange={props.update}></Textarea>
    </div>
  )
}
