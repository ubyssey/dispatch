import React from 'react'

require('../../../../styles/components/image_thumb.scss')

export default function ImageThumb(props) {

  const style = {
    backgroundImage: `url('${props.image.url_thumb}')`
  }

  const baseClass = 'c-image-thumb'
  const componentClass = props.isSelected ? `${baseClass} ${baseClass}--selected` : baseClass

  return (
    <div
      className={componentClass}
      style={props.width ? { width: props.width} : {}}>
      <div
        className='c-image-thumb__inner'
        onClick={() => props.selectImage(props.image.id)}
        style={style} />
    </div>
  )
}
