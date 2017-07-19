import React from 'react'

import TagEditor from '../../components/TagEditor'

export default function TagPage(props) {
  return (
    <TagEditor
      itemId={props.params.tagId}
      goBack={props.history.goBack}
      route={props.route} />
  )
}
