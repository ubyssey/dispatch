import React from 'react'

import PageEditor from '../../components/PageEditor'

export default function NewPagePage(props) {
  return (
    <PageEditor
      isNew={true}
      goBack={props.history.goBack}
      route={props.route} />
  )
}
