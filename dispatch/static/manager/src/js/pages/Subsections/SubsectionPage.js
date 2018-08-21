import React from 'react'

import SubsectionEditor from '../../components/SubsectionEditor'

export default function SubsectionPage(props) {
  return (
    <SubsectionEditor
      itemId={props.params.subsectionId}
      location={props.location}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
