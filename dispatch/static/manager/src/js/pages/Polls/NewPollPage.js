import React from 'react'

import PollEditor from '../../components/PollEditor'

export default function NewPollPage(props) {
  return (
    <PollEditor
      isNew={true}
      goBack={props.history.goBack}
      route={props.route} />
  )
}
