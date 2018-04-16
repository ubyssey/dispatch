import React from 'react'

import IssueEditor from '../../components/IssueEditor'

export default function NewIssuePage(props) {
  return (
    <IssueEditor
      isNew={true}
      goBack={props.history.goBack}
      route={props.route} />
  )
}
