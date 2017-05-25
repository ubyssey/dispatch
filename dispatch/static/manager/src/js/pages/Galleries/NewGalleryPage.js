import React from 'react'

import GalleryEditor from '../../components/GalleryEditor'

export default function NewTagPage(props) {
  return (
    <GalleryEditor
      isNew={true}
      goBack={props.history.goBack} />
  )
}
