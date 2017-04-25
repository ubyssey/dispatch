import React from 'react'

import SectionEditor from '../../components/SectionEditor'

export default function SectionPage(props) {
  return (
    <SectionEditor sectionId={props.params.sectionId} />
  )
}
