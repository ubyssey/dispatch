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

export function editorKeyCommand(command) {
  return {
    type: types.EDITOR_KEY_COMMAND,
    command: command
  }
}

export function insertLink(url, selection) {
  return {
    type: types.EDITOR_INSERT_LINK,
    url: url,
    selection: selection
  }
}
