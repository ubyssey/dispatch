import * as types from '../constants/ActionTypes'

export function updateEditor(editorState) {
  return {
    type: types.UPDATE_EDITOR,
    editorState: editorState
  }
}

export function toggleEditorStyle(style) {
  return {
    type: types.TOGGLE_EDITOR_STYLE,
    style: style
  }
}
