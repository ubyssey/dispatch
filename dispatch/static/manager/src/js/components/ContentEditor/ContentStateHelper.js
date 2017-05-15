import {
  ContentState,
  ContentBlock,
  CharacterMetadata,
  Entity,
  EntityInstance,
  genKey,
  convertFromHTML
} from 'draft-js'

import { List, OrderedMap } from 'immutable'

import convertToHTML from './helpers/convertToHTML'

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

function createParagraphBlock(block) {
  return convertFromHTML(block.data)
}

function createEntityBlock(block) {

  const entity = new EntityInstance({
    type: block.type,
    mutability: 'IMMUTABLE',
    data: block.data
  })

  const entityKey = Entity.add(entity)
  const charData = CharacterMetadata.create({entity: entityKey})

  let contentBlock = new ContentBlock({
    key: genKey(),
    type: 'atomic',
    text: ' ',
    characterList: List([charData])
  })

  return {
    contentBlocks: [contentBlock],
    entityMap: {entityKey: entity}
  }

}

function createBlock(acc, block) {

  let blocksFromJSON

  switch (block.type) {
  case 'paragraph':
    blocksFromJSON = createParagraphBlock(block)
    break
  case 'image':
  case 'video':
  case 'quote':
    blocksFromJSON = createEntityBlock(block)
    break
  }

  if (blocksFromJSON) {
    acc.contentBlocks = acc.contentBlocks.concat(blocksFromJSON.contentBlocks)
    acc.entityMap = acc.entityMap.merge(blocksFromJSON.entityMap)
  }

  return acc

}

const ContentStateHelper = {

  fromJSON: (jsonBlocks) => {

    const blocksFromHTML =
      jsonBlocks.reduce(
        createBlock,
        { contentBlocks: new Array(), entityMap: new OrderedMap() }
      )

    // Create new ContentState from contentBlocks and entityMap
    return ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
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
