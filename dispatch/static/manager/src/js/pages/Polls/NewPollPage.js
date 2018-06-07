import React from 'react'

import PollEditor from '../../components/PollEditor'

export default function NewPollPage(props) {
  return (
    <PollEditor
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
