import {
  ContentState,
  ContentBlock,
  CharacterMetadata,
  DraftInlineStyle,
  Entity,
  genKey
} from 'draft-js';

import { List } from 'immutable';

import convertToHTML from './helpers/convertToHTML'
import convertFromHTML from './helpers/convertFromHTML'

function createBlock(jsonBlock) {

  if (jsonBlock.type == 'paragraph') {
    return convertFromHTML(jsonBlock.data)
  } else {
    return new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      depth: 1,
      text: '',
      characterList: new List()
    })
  }

}

function parseBlock(block) {
  const type = block.getType()

  if (type === 'atomic') {
    const entity = Entity.get(block.getEntityAt(0))
    return {
      type: entity.getType().toLowerCase(),
      data: entity.getData()
    }
  } else {
    return {
      type: 'paragraph',
      data: convertToHTML(block)
    }
  }

}

const ContentStateHelper = {

  fromJSON: (jsonBlocks) => {
    // Converts from JSON to ContentState
    return ContentState.createFromBlockArray(
      jsonBlocks.map(createBlock)
    )
  },

  toJSON: (contentState) => {
    // Converts from ContentState to JSON
    return contentState.getBlockMap()
      .map(parseBlock)
      .toList()
      .toJS()
  }

}

export default ContentStateHelper
