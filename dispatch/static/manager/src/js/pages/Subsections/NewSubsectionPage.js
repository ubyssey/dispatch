import React from 'react'

import SubsectionEditor from '../../components/SubsectionEditor'

export default function NewSubsectionPage(props) {
  return (
    <SubsectionEditor
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
