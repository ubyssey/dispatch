import React from 'react'

import ContentEditorLinkEditor from './ContentEditorLinkEditor.jsx'

const LINK_INPUT_WIDTH = 334

export default function ContentEditorPopover(props) {

  const style = {width: LINK_INPUT_WIDTH}

  return (
    <div
      className='c-content-editor__popover'
      onMouseUp={e => e.stopPropagation()}
      style={style}>
      <ContentEditorLinkEditor
        url={props.url}
        selection={props.selection}
        insertLink={props.insertLink} />
    </div>
  )

}
