import React from 'react'

import TagEditor from '../../components/TagEditor'

export default function NewTagPage(props) {
  return (
    <TagEditor
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
