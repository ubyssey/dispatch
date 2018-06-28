import React from 'react'

import ColumnEditor from '../../components/ColumnEditor'

export default function ColumnPage(props) {
  return (
    <ColumnEditor
      itemId={props.params.columnId}
      location={props.location}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
