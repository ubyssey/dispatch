import React from 'react'

import PageEditor from '../../components/PageEditor'

export default function NewSectionPage(props) {
  return (
    <PageEditor
      isNew={true}
      goBack={props.history.goBack} />
  )
}
