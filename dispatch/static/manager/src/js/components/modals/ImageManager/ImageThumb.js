import React from 'react'

require('../../../../styles/components/image_thumb.scss')

export default function ImageThumb(props) {

  let style

  if (props.isSelected) {
    style = {
      background: `repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 10px,
        rgba(0, 0, 0, 0.3) 10px,
        rgba(0, 0, 0, 0.3) 20px
      ), url('${props.image.url_thumb}'), center center`
    }
  } else {
    style = {
      background: `url('${props.image.url_thumb}'), center center`
    }
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
