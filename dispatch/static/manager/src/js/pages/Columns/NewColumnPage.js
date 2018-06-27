import React from 'react'

import ColumnEditor from '../../components/ColumnEditor'

export default function NewColumnPage(props) {
  return (
    <ColumnEditor
      isNew={true}
      route={props.route} />
  )
}
