import React from 'react'

import IssueEditor from '../../components/IssueEditor'

export default function IssuePage(props) {
  return (
    <IssueEditor
      itemId={props.params.issueId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
