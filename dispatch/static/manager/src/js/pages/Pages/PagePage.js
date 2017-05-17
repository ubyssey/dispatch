import React from 'react'

import PageEditor from '../../components/PageEditor'

export default function NewPagePage(props) {
  return (
    <PageEditor
      pageId={props.params.pageId}
      goBack={props.history.goBack} />
  )
}
