import React from 'react'

import SectionEditor from '../../components/SectionEditor'

export default function NewSectionPage(props) {
  return (
    <SectionEditor
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
