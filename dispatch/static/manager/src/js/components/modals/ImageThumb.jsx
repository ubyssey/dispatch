import React from 'react'

export default function ImageThumb(props) {
  const style = {
    backgroundImage: `url('${props.image.thumb}')`
  }

  const baseClass = 'c-image-thumb'
  const componentClass = props.isSelected ? `${baseClass} ${baseClass}--selected` : baseClass

  function handleClick(e) {
    e.preventDefault()
    props.selectImage(props.image.id)
  }

  return (
    <div className={componentClass}>
      <div
        className='c-image-thumb__inner'
        onClick={handleClick}
        style={style}></div>
    </div>
  )
}
