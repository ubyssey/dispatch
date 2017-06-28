import {
  EditorState,
  AtomicBlockUtils,
  Entity,
  Modifier,
  RichUtils
} from 'draft-js'

export function insertLink(editorState, selection, url) {
  return RichUtils.toggleLink(
    editorState,
    selection ? selection : editorState.getSelection(),
    Entity.create('LINK', 'IMMUTABLE', { url: url })
  )
}

export function removeLink(editorState, selection) {
  return RichUtils.toggleLink(
    editorState,
    selection ? selection : editorState.getSelection(),
    null
  )
}

export function handleKeyCommand(editorState, command) {
  return RichUtils.handleKeyCommand(editorState, command) || editorState
}

export function toggleInlineStyle(editorState, style) {
  return RichUtils.toggleInlineStyle(editorState, style)
}

export function insertEmbed(editorState, blockKey, type, data={}) {
  // Create new entity with given type and data
  const entityKey = Entity.create(type, 'IMMUTABLE', data)

  // Fetch editorState and contentState
  let contentState = editorState.getCurrentContent()

  // Add entity to contentState
  const contentStateWithEntity = Modifier.applyEntity(
    contentState,
    contentState.getSelectionAfter(),
    entityKey
  )

  // Update editorState with new contentState
  editorState = EditorState.set(
    editorState,
    {'currentContent': contentStateWithEntity}
  )

  // Insert atomic block
  editorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')

  // Fetch the new contentState
  contentState = editorState.getCurrentContent()

  // Remove the empty block from the blockMap
  let blockMap = contentState.getBlockMap()
  contentState = contentState.set('blockMap', blockMap.delete(blockKey))

  // Update editorState with new contentState
  editorState = EditorState.set(
    editorState,
    {currentContent: contentState}
  )

  return editorState
}

export function removeEmbed(editorState, blockKey) {
  // Fetch editorState and contentState
  let contentState = editorState.getCurrentContent()

  // Remove the block from the blockMap
  let blockMap = contentState.getBlockMap()
  contentState = contentState.set('blockMap', blockMap.delete(blockKey))

  // Update editorState with new contentState
  editorState = EditorState.set(
    editorState,
    {currentContent: contentState}
  )

  return editorState
}
