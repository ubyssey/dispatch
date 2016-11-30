import { EditorState, RichUtils } from 'draft-js'

import * as types from '../constants/ActionTypes'

const initialState = EditorState.createEmpty()

export default function editorReducer(editorState = initialState, action) {
  switch (action.type) {
    case types.UPDATE_EDITOR:
      return action.editorState
    case types.TOGGLE_EDITOR_STYLE:
      return RichUtils.toggleInlineStyle(editorState, action.style)
    default:
      return editorState
  }
}
