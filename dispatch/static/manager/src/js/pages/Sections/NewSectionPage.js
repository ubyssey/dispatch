import React from 'react'

import SectionEditor from '../../components/SectionEditor'

export default function NewSectionPage(props) {
  return (
    <SectionEditor
      isNew={true}
      goBack={props.history.goBack}
      route={props.route} />
  )
}
