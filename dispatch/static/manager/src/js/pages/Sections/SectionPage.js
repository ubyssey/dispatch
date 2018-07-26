import React from 'react'

import SectionEditor from '../../components/SectionEditor'

export default function SectionPage(props) {
  return (
    <SectionEditor
      itemId={props.params.sectionId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
