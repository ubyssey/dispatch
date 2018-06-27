import React from 'react'

import ColumnEditor from '../../components/ColumnEditor'

export default function ColumnPage(props) {
  return (
    <ColumnEditor
      columId={props.params.columnId}
      location={props.location}
      route={props.route} />
  )
}
