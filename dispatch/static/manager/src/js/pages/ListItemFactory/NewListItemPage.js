import React from 'react'

export default function NewListItemPage(props) {
  return React.createElement(props.editorClass, {
    isNew: true,
    goBack: props.history.goBack
  })
}
