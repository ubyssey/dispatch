import { EditorState, RichUtils, Entity } from 'draft-js'

import * as types from '../constants/ActionTypes'

const initialState = EditorState.createEmpty()

export default function editorReducer(editorState = initialState, action) {
  switch (action.type) {
  case types.UPDATE_EDITOR:
    return action.editorState

  case types.TOGGLE_EDITOR_STYLE:
    return RichUtils.toggleInlineStyle(editorState, action.style)

  case types.EDITOR_KEY_COMMAND:
    return RichUtils.handleKeyCommand(editorState, action.command) || editorState

  case types.EDITOR_INSERT_LINK:
    return RichUtils.toggleLink(
      editorState,
      action.selection ? action.selection : editorState.getSelection(),
      Entity.create('LINK', 'IMMUTABLE', { url: action.url })
    )

  case types.EDITOR_REMOVE_LINK:

    return RichUtils.toggleLink(
      editorState,
      action.selection ? action.selection : editorState.getSelection(),
      null
    )

  default:
    return editorState
  }
}
