import React from 'react'

import PageEditor from '../../components/PageEditor'

export default function NewSectionPage(props) {
  return (
    <PageEditor
      pageId={props.params.pageId}
      goBack={props.history.goBack} />
  )
}
