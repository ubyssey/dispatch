import React from 'react'

export default function ListItemPage(props) {
  return React.createElement(props.editorClass, {
    itemId: props.params.itemId,
    goBack: props.history.goBack
  })
}
