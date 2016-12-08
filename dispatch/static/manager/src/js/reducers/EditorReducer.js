import { EditorState, RichUtils, Entity, Modifier } from 'draft-js'

import * as types from '../constants/ActionTypes'

const initialState = EditorState.createEmpty()

export default function editorReducer(editorState = initialState, action) {
  switch (action.type) {
    case types.UPDATE_EDITOR:
      return action.editorState
    case types.TOGGLE_EDITOR_STYLE:
      return RichUtils.toggleInlineStyle(editorState, action.style)
    case types.EDITOR_KEY_COMMAND:
      const newState = RichUtils.handleKeyCommand(editorState, action.command)
      return newState ? newState : editorState
    case types.EDITOR_INSERT_LINK:
      // Create new link entity
      const entityKey = Entity.create('LINK', 'IMMUTABLE', { url: action.url })

      const selectionState = action.selection ? action.selection : editorState.getSelection()

      return RichUtils.toggleLink(
        editorState,
        selectionState,
        entityKey
      )

    default:
      return editorState
  }
}
