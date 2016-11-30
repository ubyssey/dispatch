import React from 'react'
import { AnchorButton } from '@blueprintjs/core'

export default function ContentEditorPopover(props) {

  function toggleStyle(e, style) {
    e.stopPropagation()
    props.focusEditor()
    props.toggleStyle(style)
  }

  function handleMouseUp(e) {
    e.stopPropagation()
  }

  return (
    <div
      className='c-content-editor__popover'
      onMouseUp={handleMouseUp}>
      <AnchorButton
        className='c-content-editor__popover__button'
        onClick={ e => toggleStyle(e, 'BOLD') }
        title='Bold'>
        <span className='pt-icon-standard pt-icon-bold'></span>
      </AnchorButton>
      <AnchorButton
        className='c-content-editor__popover__button'
        onClick={ e => toggleStyle(e, 'ITALIC') }
        title='Italic'>
        <span className='pt-icon-standard pt-icon-italic'></span>
      </AnchorButton>
      <AnchorButton
        className='c-content-editor__popover__button'
        onClick={ e => toggleStyle(e, 'UNDERLINE') }
        title='Underline'>
        <span className='pt-icon-standard pt-icon-underline'></span>
      </AnchorButton>
      <AnchorButton
        className='c-content-editor__popover__button'
        title='Header'>
        <span className='pt-icon-standard pt-icon-header'></span>
      </AnchorButton>
      <AnchorButton
        className='c-content-editor__popover__button'
        title='List'>
        <span className='pt-icon-standard pt-icon-properties'></span>
      </AnchorButton>
      <AnchorButton
        className='c-content-editor__popover__button'
        title='Link'>
        <span className='pt-icon-standard pt-icon-link'></span>
      </AnchorButton>
    </div>
  )
}
