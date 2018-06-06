import React from 'react'

import TopicEditor from '../../components/TopicEditor'

export default function TopicPage(props) {
  return (
    <TopicEditor
      itemId={props.params.topicId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
