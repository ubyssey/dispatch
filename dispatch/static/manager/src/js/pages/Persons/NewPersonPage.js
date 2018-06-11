import React from 'react'

import PersonEditor from '../../components/PersonEditor'

export default function NewPersonPage(props) {
  return (
    <PersonEditor
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
