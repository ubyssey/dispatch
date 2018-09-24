import React from 'react'

import ZoneEditor from '../../components/ZoneEditor'

export default function ZonePage(props) {
  return (
    <ZoneEditor
      zoneId={props.params.zoneId} />
  )
}
