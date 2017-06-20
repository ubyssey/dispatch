import React from 'react'

import TopicEditor from '../../components/TopicEditor'

export default function NewTopicPage(props) {
  return (
    <TopicEditor
      isNew={true}
      goBack={props.history.goBack}
      route={props.route} />
  )
}
