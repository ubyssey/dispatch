import React from 'react'

import PollEditor from '../../components/PollEditor'

export default function PollPage(props) {
  return (
    <PollEditor
      itemId={props.params.pollId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
