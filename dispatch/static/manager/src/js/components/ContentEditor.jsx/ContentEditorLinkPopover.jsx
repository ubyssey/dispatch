import React from 'react'

import ContentEditorLinkEditor from './ContentEditorLinkEditor.jsx'

export default function ContentEditorPopover(props) {

  return (
    <div
      className='c-content-editor__popover'
      onMouseUp={e => e.stopPropagation()}>
      <ContentEditorLinkEditor
        url={props.url}
        selection={props.selection}
        insertLink={props.insertLink} />
    </div>
  )

}
