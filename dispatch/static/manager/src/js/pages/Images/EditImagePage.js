import React from 'react'


import ImageEditor from '../../components/ImageEditor'

export default function EditImagePage(props) {
  return (
    <ImageEditor
      itemId={props.params.imageId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
