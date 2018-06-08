import React from 'react'

import GalleryEditor from '../../components/GalleryEditor'

export default function TagPage(props) {
  return (
    <GalleryEditor
      itemId={props.params.galleryId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
