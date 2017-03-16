import React from 'react'

function getClassName(disabled) {
  return 'c-input c-input--button' + (disabled ? ' c-input--disabled' : '')
}

export default function Button(props) {

  function handleOnClick(e) {
    if (!props.disabled) {
      return props.onClick(e)
    } else {
      e.preventDefault()
    }
  }

  return (
    <a
      className={getClassName(props.disabled)}
      onClick={handleOnClick}>{props.children}</a>
  )
}
